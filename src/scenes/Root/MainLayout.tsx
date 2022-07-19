import { makeStyles } from '@material-ui/core';
import { Outlet } from 'react-router-dom';
import { useAuthRequired } from '../Authentication';
import { CreateDialogProviders } from './Creates';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const useStyles = makeStyles(() => ({
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
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CreateDialogProviders>
        <Sidebar />
      </CreateDialogProviders>
      <div className={classes.main}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};
