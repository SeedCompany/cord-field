import { Chip, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { ReactElement, ReactNode } from 'react';
import { Except } from 'type-fest';
import { Secured } from '../../api';
import { Redacted } from '../Redacted';

export interface BooleanPropertyProps {
  label: ReactNode;
  redacted: string;
  data?: Except<Secured<boolean>, 'canEdit'>;
  wrap?: (node: ReactNode) => ReactElement;
}

const useStyles = makeStyles(({ palette, shape }) => ({
  root: {
    background: palette.info.main,
    color: palette.info.contrastText,
    borderRadius: shape.borderRadius,
    height: 26,
  },
}));

export const BooleanProperty = ({
  label,
  redacted,
  data,
  wrap,
}: BooleanPropertyProps) => {
  const classes = useStyles();

  const chip = <Chip label={label} className={classes.root} />;

  const out = !data ? (
    <Skeleton>{chip}</Skeleton>
  ) : !data.canRead ? (
    <Redacted info={redacted}>{chip}</Redacted>
  ) : data.value ? (
    chip
  ) : null;
  if (!out) {
    return null;
  }
  return wrap ? wrap(out) : out;
};
