import { Card, CardProps, Divider, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import * as React from 'react';
import { Children, Fragment } from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    display: 'flex',
  },
  divider: {
    margin: spacing(2, 0),
  },
}));

export const CardGroup = ({ children, ...rest }: CardProps) => {
  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, rest.className)}>
      {Children.map(children, (child, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <Divider
              className={classes.divider}
              orientation="vertical"
              flexItem
            />
          )}
          {child}
        </Fragment>
      ))}
    </Card>
  );
};
