import { AppBar, Toolbar } from '@mui/material';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

export const Header = () => (
  <AppBar position="static" color="inherit" elevation={1} sx={{ zIndex: 1 }}>
    <Toolbar sx={{ gap: 3, justifyContent: 'space-between' }}>
      <HeaderSearch sx={{ flex: 1, maxWidth: 500 }} />
      <ProfileToolbar />
    </Toolbar>
  </AppBar>
);
