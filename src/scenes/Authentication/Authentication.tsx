import { CircularProgress, makeStyles } from '@material-ui/core';
import React, { FC, useEffect } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { useSession } from '../../components/Session';
import { ForgotPassword } from './ForgotPassword';
import { Login } from './Login/Login';
import { Logout } from './Logout';
import { ResetPassword } from './ResetPassword';

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  card: {
    maxWidth: 400,
  },
}));

export const Authentication: FC = ({ children }) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [session, sessionLoading] = useSession();

  const matched = useRoutes([
    { path: '/login', element: <Login className={classes.card} /> },
    { path: '/logout', element: <Logout /> },
    {
      path: '/forgot-password',
      element: <ForgotPassword className={classes.card} />,
    },
    {
      path: '/reset-password/:token',
      element: <ResetPassword className={classes.card} />,
    },
  ]);

  useEffect(() => {
    if (!session && !sessionLoading && !matched) {
      navigate('/login', { replace: true });
    }
  }, [session, sessionLoading, navigate, matched, location]);

  // render anonymous auth scene
  if (matched) {
    return <div className={classes.root}>{matched}</div>;
  }

  // logged in, show app
  if (session) {
    return <>{children}</>;
  }

  // not logged in, show spinner while waiting for session & redirect to login
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};
