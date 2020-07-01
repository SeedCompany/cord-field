import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: theme.spacing(4),
    maxWidth: theme.breakpoints.values.md,
  },
}));

export const ContentContainer: FC = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};
