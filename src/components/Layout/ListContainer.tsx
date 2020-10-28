import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC } from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    height: '100%',
    marginLeft: spacing(-2),
    overflow: 'auto',
    padding: spacing(2),
  },
}));

interface ListContainerProps {
  className?: string;
}

export const ListContainer: FC<ListContainerProps> = ({
  className,
  children,
}) => {
  const classes = useStyles();
  return <div className={clsx(classes.root, className)}>{children}</div>;
};
