import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Toolbar } from '@mui/material';
import { useIsMobile } from '~/common';
import { IconButton } from '~/components/IconButton';
import { MobileFilterButton } from '~/components/List';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

export interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const isMobile = useIsMobile();
  return (
    <AppBar position="static" color="inherit" sx={{ zIndex: 1 }}>
      <Toolbar sx={{ gap: 3, justifyContent: 'space-between' }}>
        {isMobile && (
          <IconButton
            edge="start"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
        )}
        <HeaderSearch sx={{ flex: 1, maxWidth: 500 }} />
        {isMobile && <MobileFilterButton />}
        <ProfileToolbar />
      </Toolbar>
    </AppBar>
  );
};
