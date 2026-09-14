import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Outlet, useLocation } from 'react-router-dom';
import { CommentsBar } from '~/components/Comments/CommentsBar';
import { MobileFilterProvider } from '~/components/List';
import { MaintenanceBanner } from '~/components/MaintenanceBanner';
import { Error } from '../../components/Error';
import { useAuthRequired } from '../Authentication';
import { CreateDialogProviders } from './Creates';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  useAuthRequired();

  const [navOpen, setNavOpen] = useState(false);

  // Close the mobile nav drawer whenever the route changes.
  const { pathname } = useLocation();
  useEffect(() => setNavOpen(false), [pathname]);

  return (
    <MobileFilterProvider>
      <Box
        sx={{
          flex: 1,
          // Without this, this flex child keeps its default `min-width: auto` and
          // grows to its content's width, cascading an over-wide layout down to
          // the lists (their `noWrap` text then can't ellipsize). Pin it so the
          // shell stays within the viewport and the constraint propagates down.
          minWidth: 0,
          display: 'flex',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CreateDialogProviders>
          <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
        </CreateDialogProviders>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <Header onMenuClick={() => setNavOpen(true)} />
          <MaintenanceBanner />
          <ErrorBoundary fallback={<Error show page />}>
            <Outlet />
          </ErrorBoundary>
        </Box>
        <CommentsBar />
      </Box>
    </MobileFilterProvider>
  );
};
