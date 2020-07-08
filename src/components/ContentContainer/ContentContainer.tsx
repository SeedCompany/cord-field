import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'hidden',
    padding: spacing(4, 0, 0, 4),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const ContentContainer: FC = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};
