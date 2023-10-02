'use client'
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import UserBar from './UserBar'
import { usePathname } from 'next/navigation'

const menuItems = [
  {
    href: '/restreamer',
    icon: 'https://demo.datarhei.com/ui/static/media/rs-logo.c688a779e3fc730f1379448ecd09b1aa.svg',
    textPrimary: 'Restreamer',
    textSecondary: 'https://datarhei.com',
  },
  {
    disabled: true,
    href: '/owncast',
    icon: 'https://owncast.online/images/logo.svg',
    textPrimary: 'Owncast',
    textSecondary: 'https://owncast.online',
  },
]

export const DrawerMenu = () => {
  const pathname = usePathname()
  return (
    <Drawer open variant="persistent" sx={{ minWidth: 288 }}>
      <Toolbar sx={{ minWidth: 288 }} disableGutters className="px-2">
        <img
          className="w-[48px] max-h-[48px] mr-4"
          alt="ZapStream"
          src="data:image/png;base64,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"
        />
        <Box display="flex" flexDirection="column">
          <Typography>ZapStream Tools</Typography>
          <Typography variant="caption" color="text.secondary">
            Live streaming tools for ZapStream
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List subheader={<ListSubheader>Viewer count updater</ListSubheader>}>
        {menuItems.map((item) => {
          return (
            <ListItemButton
              key={item.href}
              LinkComponent={Link}
              dense
              href={item.href}
              selected={pathname === item.href}
              disabled={item.disabled}
            >
              <ListItemIcon>
                <img
                  className="w-[48px] max-h-[48px]"
                  src={item.icon}
                  alt={item.textPrimary}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.textPrimary}
                secondary={item.textSecondary}
              />
            </ListItemButton>
          )
        })}
      </List>
      <Box flex={1} />
      <UserBar />
    </Drawer>
  )
}
