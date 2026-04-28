import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

export interface HeaderProps {
  /** Toggle the navigation sidebar (visible at all viewport sizes). */
  onMenuClick?: () => void;
  /** Whether the navigation is currently open — used for `aria-expanded`. */
  navOpen?: boolean;
}

export const Header = ({ onMenuClick, navOpen }: HeaderProps) => (
  <AppBar position="static" color="inherit" sx={{ zIndex: 1 }}>
    <Toolbar sx={{ gap: 3, justifyContent: 'space-between' }}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="toggle navigation menu"
        aria-expanded={navOpen}
        onClick={onMenuClick}
      >
        <MenuIcon />
      </IconButton>
      <HeaderSearch sx={{ flex: 1, maxWidth: 500 }} />
      <ProfileToolbar />
    </Toolbar>
  </AppBar>
);
