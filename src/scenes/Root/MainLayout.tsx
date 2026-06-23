import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Outlet, useLocation } from 'react-router-dom';
import { CommentsBar } from '~/components/Comments/CommentsBar';
import { MobileFilterProvider } from '~/components/List';
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
          <ErrorBoundary fallback={<Error show page />}>
            <Outlet />
          </ErrorBoundary>
        </Box>
        <CommentsBar />
      </Box>
    </MobileFilterProvider>
  );
};
