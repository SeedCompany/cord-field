import { Box, Drawer, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import { CommentsBar } from '~/components/Comments/CommentsBar';
import { Error } from '../../components/Error';
import { useAuthRequired } from '../Authentication';
import { CreateDialogProviders } from './Creates';
import { Header } from './Header';
import { useNavOpenState } from './navOpenState';
import { Sidebar, SIDEBAR_WIDTH, SidebarContent } from './Sidebar';
import { sidebarTheme } from './Sidebar/sidebar.theme';

// Distinct ids per variant: both the persistent Sidebar and the temporary
// Drawer can be in the DOM simultaneously (Sidebar is always rendered;
// Drawer content mounts on open), so a single shared id would duplicate DOM
// ids. The hamburger's `aria-controls` swaps to whichever variant is active.
const DESKTOP_NAV_ID = 'main-nav-desktop';
const MOBILE_NAV_ID = 'main-nav-mobile';

export const MainLayout = () => {
  useAuthRequired();
  // Width-based — landscape phones (<900px wide) correctly use the mobile drawer.
  // `noSsr: true` defers evaluation to the client so we don't hydrate the
  // mobile layout on a desktop session and then visibly snap to desktop.
  const isDesktop = useMediaQuery('(min-width:756px)', { noSsr: true });

  // Persistent on desktop (defaults open), temporary overlay on mobile (defaults closed).
  const { navState, handleToggle, closeMobile } = useNavOpenState(isDesktop);
  const { desktopOpen, mobileOpen } = navState;

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
        <Sidebar open={desktopOpen} id={DESKTOP_NAV_ID} />
        <Drawer
          variant="temporary"
          // Defensive: never let the temporary Modal stay mounted-as-open on
          // desktop, which would leave focus trap / scroll lock active off-screen.
          open={!isDesktop && mobileOpen}
          onClose={closeMobile}
          anchor="left"
          PaperProps={{ id: MOBILE_NAV_ID }}
          sx={{
            display: 'block',
            '@media (min-width:756px)': {
              display: 'none',
            },
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
          // Prevents the main flex child from overflowing as the sidebar
          // resizes, and allows nested content to shrink/truncate instead
          // of forcing overflow.
          minWidth: 0,
        }}
      >
        <Header
          onMenuClick={handleToggle}
          navOpen={navOpen}
          navControlsId={isDesktop ? DESKTOP_NAV_ID : MOBILE_NAV_ID}
        />
        <ErrorBoundary fallback={<Error show page />}>
          <Outlet />
        </ErrorBoundary>
      </Box>
      <CommentsBar />
    </Box>
  );
};
