'use client'
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react'
import NDK, {
  NDKEvent,
  NDKRelay,
  NDKSubscriptionCacheUsage,
  NDKUser,
} from '@nostr-dev-kit/ndk'
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie'

interface Nostr {
  ndk: NDK
  connected: boolean
  connectRelays: (relays?: string[]) => void
  getUser: (hexpubkey: string) => Promise<NDKUser | undefined>
  getEvent: (id: string) => Promise<NDKEvent | null>
}

const defaultRelays = (process.env.NEXT_PUBLIC_RELAY_URLS || '')
  .split(',')
  .filter((item) => !!item)

const ndk = new NDK({
  cacheAdapter: new NDKCacheAdapterDexie({ dbName: 'wherostr-ndk-db' }),
  explicitRelayUrls: (process.env.NEXT_PUBLIC_RELAY_URLS || '')
    .split(',')
    .filter((item) => !!item),
})

export const NostrContext = createContext<Nostr>({
  ndk,
  connected: false,
  connectRelays: (relays?: string[]) => {},
  getUser: () => new Promise((resolve) => resolve(undefined)),
  getEvent: () => new Promise((resolve) => resolve(null)),
})

export const NostrContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [connected, setConnected] = useState(false)

  const connectRelays = useCallback(
    async (relays: string[] = defaultRelays) => {
      setConnected(false)
      ndk.explicitRelayUrls?.forEach((r) => {
        if (relays.includes(r)) return
        new NDKRelay(r).disconnect()
      })
      ndk.explicitRelayUrls = relays
      await ndk.connect()
      setConnected(true)
    },
    [],
  )

  const getUser = useCallback(async (hexpubkey: string) => {
    const user = ndk.getUser({ hexpubkey })
    await user.fetchProfile({
      cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
    })
    return user
  }, [])

  const getEvent = useCallback(async (id: string) => {
    const event = await ndk.fetchEvent(id, {
      cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
    })
    return event
  }, [])

  const value = useMemo((): Nostr => {
    return {
      connected,
      ndk,
      connectRelays,
      getUser,
      getEvent,
    }
  }, [connected, connectRelays, getUser, getEvent])
  return <NostrContext.Provider value={value}>{children}</NostrContext.Provider>
}
