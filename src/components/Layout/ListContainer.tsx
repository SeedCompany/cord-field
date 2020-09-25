import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    overflow: 'auto',
    marginLeft: spacing(-2),
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
  return (
    <div className={`${classes.root}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
};
