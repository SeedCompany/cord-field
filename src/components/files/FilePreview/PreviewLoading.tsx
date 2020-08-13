import { Grid, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';

const useStyles = makeStyles(() => ({
  container: {
    minWidth: '200px',
  },
}));

export const PreviewLoading = () => {
  const classes = useStyles();
  return (
    <Grid item>
      <Skeleton
        variant="rect"
        className={classes.container}
        width="100%"
        height={200}
      />
    </Grid>
  );
};
