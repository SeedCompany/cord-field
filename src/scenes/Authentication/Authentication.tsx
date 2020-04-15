import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Login } from './Login/Login';

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
  ]);

  // Render not found in isolation
  if (!matched) {
    return <div>Not Found</div>;
  }

  // Wrap selected route with page layout
  return <div className={classes.root}>{matched}</div>;
};
