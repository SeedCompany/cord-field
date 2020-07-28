import { Chip, ChipProps, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { ReactElement } from 'react';
import { Except, SetRequired } from 'type-fest';
import { Secured } from '../../api';
import { Redacted } from '../Redacted';

export interface BooleanPropertyProps extends SetRequired<ChipProps, 'label'> {
  redacted: string;
  data?: Except<Secured<boolean>, 'canEdit'>;
  wrap?: (node: ReactElement) => ReactElement;
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
  redacted,
  data,
  wrap,
  ...rest
}: BooleanPropertyProps) => {
  const classes = useStyles();

  const chip = <Chip {...rest} className={classes.root} />;

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
