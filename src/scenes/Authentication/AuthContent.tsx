import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 400,
    margin: spacing(4, 1),
  },
}));

interface AuthContentProps {
  className?: string;
  children?: ReactNode;
}

export const AuthContent = ({ className, children }: AuthContentProps) => {
  const classes = useStyles();
  return <div className={clsx(classes.root, className)}>{children}</div>;
};
