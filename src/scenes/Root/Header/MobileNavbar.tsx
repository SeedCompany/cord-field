import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Theme,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Squash as Hamburger } from 'hamburger-react';
import { useEffect, useState } from 'react';
import {
  alignItemsCenter,
  extendSx,
  justifySpaceBetween,
  StyleProps,
} from '~/common';
import { RootNavList } from '../RootNavList';
import { SidebarHeader } from '../Sidebar';
import { sidebarTheme } from '../Sidebar/sidebar.theme';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

// const colorContrast = { color: 'primary.contrastText' } satisfies Sx;

export const MobileNavbar = ({ sx }: StyleProps) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  return (
    <ThemeProvider theme={sidebarTheme}>
      <AppBar
        css={alignItemsCenter}
        position="sticky"
        sx={[{ bgcolor: '#ffffff', overflow: 'hidden' }, ...extendSx(sx)]}
      >
        <Toolbar sx={{ width: 1 }}>
          <Box css={[justifySpaceBetween, alignItemsCenter, { width: '100%' }]}>
            <Box css={alignItemsCenter}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setOpen(true)}
              >
                <Hamburger
                  toggled={open}
                  toggle={setOpen}
                  size={18}
                  duration={0.3}
                  distance="sm"
                  easing="ease-in"
                  color="#6B7073"
                />
              </IconButton>
            </Box>
            <HeaderSearch />
            <ProfileToolbar />
          </Box>
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            BackdropProps={{ invisible: true }}
            elevation={0}
            sx={{
              '& > .MuiDrawer-paper': {
                width: 240,
                mt: 9,
                // 72px is the height of the AppBar and is 9 * 8px
                height: 'calc(100vh - 72px)',
                backgroundColor: 'background.sidebar',
              },
            }}
          >
            <SidebarHeader />
            <RootNavList />
            <Box
              sx={{
                height: 1,
                display: 'flex',
                flex: 1,
                flexShrink: 0,
                cursor: 'pointer',
                backgroundColor: 'white',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 60,
                  height: 1,
                  backgroundColor: 'background.paper',
                }}
              />
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};
