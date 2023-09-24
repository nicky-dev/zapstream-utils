import './globals.css'
import { Metadata } from 'next'
import { DefaultTheme } from '@/themes'
import { NostrContextProvider } from '@/contexts/NostrContext'
import { AppContextProvider } from '@/contexts/AppContext'
import { AccountContextProvider } from '@/contexts/AccountContext'
import UserBar from '@/components/UserBar'

export const metadata: Metadata = {
  title: 'ZapStream Utilities',
  description: 'Live streaming tools for ZapStream',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <DefaultTheme>
          <NostrContextProvider>
            <AppContextProvider>
              <AccountContextProvider>
                <header className="absolute top-0 right-0 z-10">
                  <UserBar />
                </header>
                <main className="min-h-screen flex flex-col">{children}</main>
              </AccountContextProvider>
            </AppContextProvider>
          </NostrContextProvider>
        </DefaultTheme>
      </body>
    </html>
  )
}
