import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useRoutes } from 'react-router-dom';

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

export const Organizations = () => {
  const classes = useStyles();

  const matched = useRoutes([
    {
      path: '/',
      element: <div>TODO = Here should be filled with org routes.</div>,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <div className={classes.root}>{matched}</div>;
};
