import { Outlet, useParams } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { firstValue } from '~/common';
import { useAuthRequired } from '../Authentication';
import { CommentsBar } from './CommentsBar';
import { CreateDialogProviders } from './Creates';
import { Header } from './Header';
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
  const resourceId = firstValue(useParams()) ?? '';
  return (
    <div className={classes.root}>
      <CreateDialogProviders>
        <Sidebar />
      </CreateDialogProviders>
      <div className={classes.main}>
        <Header />
        <Outlet />
      </div>
      <CommentsBar resourceId={resourceId} />
    </div>
  );
};
