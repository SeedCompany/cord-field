import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { useAuthRequired } from '../Authentication';
import { CreateDialogProviders } from './Creates';
import { Header } from './Header';
import { MobileNavbar } from './Header/MobileNavbar';
import { Sidebar } from './Sidebar';

const useStyles = makeStyles()(() => ({
  root: {
    flex: 1,
    display: 'flex',
    height: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const MainLayout = () => {
  useAuthRequired();
  const { classes } = useStyles();
  return (
    <Box
      className={classes.root}
      sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
    >
      <CreateDialogProviders>
        <Sidebar sx={{ display: { xs: 'none', sm: 'block' } }} />
        <MobileNavbar sx={{ display: { xs: 'flex', sm: 'none' } }} />
      </CreateDialogProviders>
      <div className={classes.main}>
        <Header />
        <Outlet />
      </div>
    </Box>
  );
};
