import { makeStyles, Tooltip, TooltipProps } from '@material-ui/core';
import { Skeleton, SkeletonProps } from '@material-ui/lab';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { Except } from 'type-fest';

export interface RedactedProps {
  info: TooltipProps['title'];
  width?: SkeletonProps['width'];
  TooltipProps?: Except<TooltipProps, 'title'>;
  SkeletonProps?: SkeletonProps;
}

const useStyles = makeStyles(() => ({
  redacted: {
    transform: 'initial',
  },
}));

export const Redacted: FC<RedactedProps> = ({
  info,
  width,
  TooltipProps,
  SkeletonProps,
  children,
}) => {
  const classes = useStyles();
  return (
    <Tooltip title={info} {...TooltipProps}>
      <Skeleton
        animation={false}
        width={width}
        {...SkeletonProps}
        classes={{
          ...SkeletonProps?.classes,
          text: clsx(classes.redacted, SkeletonProps?.classes?.text),
        }}
      >
        {children}
      </Skeleton>
    </Tooltip>
  );
};
