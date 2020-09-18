import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    overflow: 'auto',
    marginLeft: spacing(-2),
    padding: spacing(2),
  },
}));

export const ListContainer: FC = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};
