import { Skeleton, SkeletonProps, Tooltip, TooltipProps } from '@mui/material';
import { Except } from 'type-fest';
import { ChildrenProp, extendSx } from '~/common';

export interface RedactedProps {
  info: TooltipProps['title'];
  width?: SkeletonProps['width'];
  TooltipProps?: Except<TooltipProps, 'title'>;
  SkeletonProps?: SkeletonProps;
}

export const Redacted = ({
  info,
  width,
  TooltipProps,
  SkeletonProps,
  children,
}: RedactedProps & ChildrenProp) => {
  return (
    <Tooltip title={info} {...TooltipProps}>
      <Skeleton
        animation={false}
        width={width}
        {...SkeletonProps}
        sx={[
          {
            text: 'initial',
          },
          ...extendSx(SkeletonProps?.sx),
        ]}
      >
        {children}
      </Skeleton>
    </Tooltip>
  );
};
