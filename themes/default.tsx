'use client'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import NextAppDirEmotionCacheProvider from './EmotionCache'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(252, 106, 3)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'rgb(3, 149, 252)',
      contrastText: '#ffffff',
    },
    success: {
      main: 'rgb(0, 221, 131)',
      contrastText: '#ffffff',
    },
    info: {
      main: 'rgb(3, 149, 252)',
      contrastText: '#ffffff',
    },
    warning: {
      main: 'rgb(253, 89, 1)',
      contrastText: '#ffffff',
    },
    error: {
      main: 'rgb(221, 38, 43)',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Noto Sans Thai',
  },
})

export default function DefaultTheme({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  )
}
