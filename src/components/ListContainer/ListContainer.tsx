import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
    maxWidth: '853px',
  },
}));

export const ListContainer: FC = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};
