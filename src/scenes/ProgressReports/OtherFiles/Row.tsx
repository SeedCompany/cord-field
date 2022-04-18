import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { MTableBodyRow } from 'material-table';
import React from 'react';

const useStyles = makeStyles(({ palette, transitions }) => ({
  root: {
    '& > *': {
      transition: transitions.create('all'),
    },
  },
  isDragging: {
    background: palette.background.default,
    '& > *': {
      opacity: 0,
    },
  },
  isOver: {},
  acceptsDrop: {
    '&$isOver': {
      background: palette.info.light,
    },
  },
  rejectsDrop: {
    opacity: 0.2,
    '&$isOver': {
      background: palette.error.light,
    },
  },
}));

export const OtherFilesRow = (props: any) => {
  const classes = useStyles();
  return (
    <MTableBodyRow
      {...props}
      className={clsx({
        [props.className ?? '']: true,
        [classes.root]: true,
      })}
    />
  );
};
