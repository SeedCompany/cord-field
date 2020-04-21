import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ForgotPassword } from './ForgotPassword/ForgotPassword';
import { Login } from './Login/Login';
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

export const Authentication = () => {
  const classes = useStyles();

  const matched = useRoutes([
    { path: '/', element: <Login className={classes.card} /> },
    {
      path: '/forgotpassword',
      element: <ForgotPassword className={classes.card} />,
    },
    {
      path: '/resetpassword',
      element: <ResetPassword className={classes.card} />,
    },
  ]);

  // Render not found in isolation
  if (!matched) {
    return <div>Not Found</div>;
  }

  // Wrap selected route with page layout
  return <div className={classes.root}>{matched}</div>;
};
