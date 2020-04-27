import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { CreateOrganization } from './Create';

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
      path: '/createOrg',
      element: <CreateOrganization className={classes.card} />,
    },
  ]);

  if (!matched) {
    return <div>Organization Not Found</div>;
  }

  return <div className={classes.root}>{matched}</div>;
};
