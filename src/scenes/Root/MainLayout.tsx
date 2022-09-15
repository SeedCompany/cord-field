import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
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
        <Outlet />
      </Box>
    </Box>
  );
};
