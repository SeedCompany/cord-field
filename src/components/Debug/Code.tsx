import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.background.paper,
    backgroundColor: theme.palette.grey[800],
  },
}));

export const Code: FC<{ json?: any; className?: string }> = ({
  className,
  json,
  children,
}) => {
  const classes = useStyles();
  return (
    <pre className={clsx(classes.root, className)}>
      {json ? JSON.stringify(json, undefined, 2) : children}
    </pre>
  );
};
