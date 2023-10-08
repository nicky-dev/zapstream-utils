'use client'
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react'
import NDK, { NDKEvent, NDKRelay, NDKUser } from '@nostr-dev-kit/ndk'
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie'
import NodeCache from 'node-cache'
import { ErrorCode } from '@/constants/app'

interface Nostr {
  ndk: NDK
  connected: boolean
  connectRelays: (relays?: string[]) => void
  getUser: (hexpubkey: string) => Promise<NDKUser | undefined>
  getEvent: (id: string) => Promise<NDKEvent | undefined>
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
  getEvent: () => new Promise((resolve) => resolve(undefined)),
})

export const NostrContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const userCache = useMemo(
    () =>
      new NodeCache({
        stdTTL: 600,
        checkperiod: 600,
      }),
    [],
  )
  const eventCache = useMemo(
    () =>
      new NodeCache({
        stdTTL: 300,
        checkperiod: 300,
      }),
    [],
  )

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

  const getUser = useCallback(
    async (hexpubkey: string) => {
      let user: NDKUser | undefined | false = userCache.get(hexpubkey)
      if (!user && user !== false) {
        userCache.set(hexpubkey, false)
        user = ndk.getUser({ hexpubkey })
        await user.fetchProfile()
        if (user) {
          if (user.profile?.name) {
            userCache.set(hexpubkey, user)
          }
          return user
        } else {
          throw new Error(ErrorCode.ProfileNotFound)
        }
      } else if (user) {
        return user
      }
    },
    [userCache],
  )
  const getEvent = useCallback(
    async (id: string) => {
      let event: NDKEvent | undefined | null | false = eventCache.get(id)
      if (!event && event !== false) {
        eventCache.set(id, false)
        event = await ndk.fetchEvent(id)
        if (event) {
          eventCache.set(id, event)
          return event
        } else {
          throw new Error(ErrorCode.EventNotFound)
        }
      } else if (event) {
        return event
      }
    },
    [eventCache],
  )
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
