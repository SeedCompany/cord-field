import { makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';

const useStyles = makeStyles(({ shape }) => ({
  loading: {
    width: '100%',
    height: 200,
    borderRadius: shape.borderRadius,
  },
}));

export const TableLoading = () => {
  const classes = useStyles();
  return <Skeleton variant="rect" className={classes.loading} />;
};
