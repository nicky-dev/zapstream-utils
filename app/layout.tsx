import './globals.css'
import { Metadata } from 'next'
import { DefaultTheme } from '@/themes'
import { NostrContextProvider } from '@/contexts/NostrContext'
import { AppContextProvider } from '@/contexts/AppContext'
import { AccountContextProvider } from '@/contexts/AccountContext'
import { DrawerMenu } from '@/components/DrawerMenu'
import { Box } from '@mui/material'

export const metadata: Metadata = {
  title: 'ZapStream Tools',
  description: 'Live streaming tools for ZapStream',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Noto+Sans+Thai"
      />
      {/* <base href="/p/478b10ed8accb6fcbb19fec499e2baf1cc5b9ef14f2ade239a562d6aa969fbce/d/zapstream-utils/" /> */}
      <body>
        <DefaultTheme>
          <NostrContextProvider>
            <AppContextProvider>
              <AccountContextProvider>
                <main className="min-h-screen flex">
                  <DrawerMenu />
                  <Box display="flex" flexDirection="column" flex={1}>
                    {children}
                  </Box>
                </main>
              </AccountContextProvider>
            </AppContextProvider>
          </NostrContextProvider>
        </DefaultTheme>
      </body>
    </html>
  )
}
