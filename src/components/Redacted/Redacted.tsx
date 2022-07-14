import {
  makeStyles,
  Skeleton,
  SkeletonProps,
  Tooltip,
  TooltipProps,
} from '@mui/material';
import clsx from 'clsx';
import { Except } from 'type-fest';
import { ChildrenProp } from '~/common';

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

export const Redacted = ({
  info,
  width,
  TooltipProps,
  SkeletonProps,
  children,
}: RedactedProps & ChildrenProp) => {
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
