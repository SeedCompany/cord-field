import { Card, Divider, makeStyles } from '@material-ui/core';
import React, { FC, Fragment, ReactNode } from 'react';

interface CardContent {
  children: ReactNode;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  divider: {
    margin: '10px 0',
  },
}));

export const CardGroup: FC<CardContent> = ({ children }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      {React.Children.map(children, (child, index) => (
        <Fragment key={index}>
          {child}
          {index % 2 === 0 && (
            <Divider
              className={classes.divider}
              orientation="vertical"
              flexItem
            />
          )}
        </Fragment>
      ))}
    </Card>
  );
};
