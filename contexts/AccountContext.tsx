'use client'
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk'
import { NostrContext } from '@/contexts/NostrContext'

interface Account {
  user?: NDKUser
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const AccountContext = createContext<Account>({
  user: undefined,
  signIn: async () => {},
  signOut: async () => {},
})

export const AccountContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { ndk, getUser, connectRelays } = useContext(NostrContext)
  const [user, setUser] = useState<NDKUser>()

  useEffect(() => {
    connectRelays()
  }, [connectRelays])

  useEffect(() => {
    if (window.nostr) {
      ndk.signer = new NDKNip07Signer()
    }
  }, [ndk])
  const signIn = useCallback(async () => {
    if (window.nostr) {
      const signerUser = await ndk.signer?.user()
      if (signerUser) {
        const _user = await getUser(signerUser.hexpubkey)
        if (_user) {
          localStorage.setItem('npub', _user.npub)
          setUser(_user)
        }
      }
    }
  }, [ndk, getUser])
  const signOut = useCallback(async () => {
    if (window.nostr) {
      ndk.signer = new NDKNip07Signer()
      localStorage.removeItem('npub')
      setUser(undefined)
    }
  }, [ndk])
  const value = useMemo((): Account => {
    return {
      user,
      signIn,
      signOut,
    }
  }, [user, signIn, signOut])
  useEffect(() => {
    if (ndk) {
      if (localStorage.getItem('npub')) {
        signIn()
      }
    }
  }, [ndk, signIn])
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  )
}
