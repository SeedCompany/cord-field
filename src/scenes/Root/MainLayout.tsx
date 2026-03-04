import { Box } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import { CommentsBar } from '~/components/Comments/CommentsBar';
import { Error } from '../../components/Error';
import { useAuthRequired } from '../Authentication';
import { CreateDialogProviders } from './Creates';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  useAuthRequired();

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
        <Sidebar />
      </CreateDialogProviders>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <ErrorBoundary fallback={<Error show page />}>
          <Outlet />
        </ErrorBoundary>
      </Box>
      <CommentsBar />
    </Box>
  );
};
