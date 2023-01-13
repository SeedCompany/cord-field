import { useMediaQuery } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { Error, useResetErrorOnLocationChange } from '../../components/Error';
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

  const isMobile = useMediaQuery('(max-width: 600px)');

  return isMobile ? (
    <div className={classes.main}>
      <CreateDialogProviders>
        <MobileNavbar />
      </CreateDialogProviders>
      <Outlet />
    </div>
  ) : (
    <div className={classes.root}>
      <CreateDialogProviders>
        <Sidebar />
      </CreateDialogProviders>
      <div className={classes.main}>
        <Header />
        <ErrorBoundary
          fallback={<Error show page />}
          ref={useResetErrorOnLocationChange()}
        >
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
};
