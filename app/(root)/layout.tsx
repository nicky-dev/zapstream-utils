import type { Metadata } from 'next'
import UserBar from '@/components/UserBar'
import { AccountContextProvider } from '@/contexts/AccountContext'

export const metadata: Metadata = {
  title: 'ZapStream Utilities',
  description: 'ZapStream Utilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccountContextProvider>
      <header className="bottom-0 left-0 absolute lg:bottom-auto lg:left-auto lg:top-0 lg:right-0 z-10">
        <UserBar />
      </header>
      <main className="min-h-screen flex flex-col">{children}</main>
    </AccountContextProvider>
  )
}
