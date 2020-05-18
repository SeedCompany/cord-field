import { Typography, TypographyProps } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { ReactNode } from 'react';
import * as React from 'react';

export type DisplaySimplePropertyProps = TypographyProps & {
  label?: string;
  LabelProps?: TypographyProps;
  value?: ReactNode;
  ValueProps?: TypographyProps;
  loading?: boolean;
  loadingWidth?: number | string;
};

export const DisplaySimpleProperty = ({
  label,
  LabelProps,
  value,
  ValueProps,
  loading,
  loadingWidth,
  ...props
}: DisplaySimplePropertyProps) => (
  <Typography variant="body2" {...props}>
    {loading ? (
      <Skeleton variant="text" width={loadingWidth} />
    ) : label && value ? (
      <>
        <Typography variant="inherit" {...LabelProps}>
          {label}:&nbsp;
        </Typography>
        <Typography variant="inherit" color="textSecondary" {...ValueProps}>
          {value}
        </Typography>
      </>
    ) : null}
  </Typography>
);
