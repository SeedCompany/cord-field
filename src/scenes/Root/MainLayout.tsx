import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, useParams } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { firstValue } from '~/common';
import { CommentsBar } from '~/components/Comments/CommentsBar';
import { Error } from '../../components/Error';
import { useAuthRequired } from '../Authentication';
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
  const resourceId = firstValue(useParams());

  const { classes } = useStyles();
  return (
    <div className={classes.root} css={{ width: 1 }}>
      <CreateDialogProviders>
        <Sidebar />
      </CreateDialogProviders>
      <div className={classes.main}>
        <Header />
        <ErrorBoundary fallback={<Error show page />}>
          <Outlet />
        </ErrorBoundary>
      </div>
      <CommentsBar resourceId={resourceId} />
    </div>
  );
};
