import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { ChildrenProp } from '~/util';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflow: 'hidden',
    padding: spacing(4, 0, 0, 4),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const ContentContainer = (
  props: { className?: string } & ChildrenProp
) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>{props.children}</div>
  );
};
