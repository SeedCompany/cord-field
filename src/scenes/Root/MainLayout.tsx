import { Box, Drawer, useMediaQuery } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import { CommentsBar } from '~/components/Comments/CommentsBar';
import { Error } from '../../components/Error';
import { useAuthRequired } from '../Authentication';
import { CreateDialogProviders } from './Creates';
import { Header } from './Header';
import { initialNavOpenState, toggleNavOpen } from './navOpenState';
import { Sidebar, SIDEBAR_WIDTH, SidebarContent } from './Sidebar';
import { sidebarTheme } from './Sidebar/sidebar.theme';

export const MainLayout = () => {
  useAuthRequired();
  const theme = useTheme();
  // Width-based — landscape phones (<900px wide) correctly use the mobile drawer.
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Persistent on desktop (defaults open), temporary overlay on mobile (defaults closed).
  const [navState, setNavState] = useState(initialNavOpenState);
  const { desktopOpen, mobileOpen } = navState;

  // If the viewport crosses up to desktop while the mobile drawer is open,
  // dismiss it so the Modal's focus trap / scroll lock don't linger
  // invisibly behind the desktop layout.
  useEffect(() => {
    if (isDesktop && mobileOpen) {
      setNavState((prev) => ({ ...prev, mobileOpen: false }));
    }
  }, [isDesktop, mobileOpen]);

  const handleToggle = useCallback(
    () => setNavState((prev) => toggleNavOpen(prev, isDesktop)),
    [isDesktop]
  );

  const closeMobile = useCallback(
    () => setNavState((prev) => ({ ...prev, mobileOpen: false })),
    []
  );

  // Mirror what the user sees: hamburger reflects the active variant's open state.
  const navOpen = isDesktop ? desktopOpen : mobileOpen;

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CreateDialogProviders>
        <Sidebar open={desktopOpen} />
        <Drawer
          variant="temporary"
          // Defensive: never let the temporary Modal stay mounted-as-open on
          // desktop, which would leave focus trap / scroll lock active off-screen.
          open={!isDesktop && mobileOpen}
          onClose={closeMobile}
          anchor="left"
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH },
          }}
        >
          <ThemeProvider theme={sidebarTheme}>
            <SidebarContent onNavigate={closeMobile} />
          </ThemeProvider>
        </Drawer>
      </CreateDialogProviders>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Header onMenuClick={handleToggle} navOpen={navOpen} />
        <ErrorBoundary fallback={<Error show page />}>
          <Outlet />
        </ErrorBoundary>
      </Box>
      <CommentsBar />
    </Box>
  );
};
