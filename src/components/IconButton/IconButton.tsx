import {
  IconButton as MUIIconButton,
  IconButtonProps as MUIIconButtonProps,
  Skeleton,
} from '@mui/material';
import { forwardRef } from 'react';

export type IconButtonProps = MUIIconButtonProps & {
  loading?: boolean;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ loading, ...props }, ref) {
    const fab = (
      <MUIIconButton
        ref={ref}
        {...props}
        className={!loading ? props.className : undefined}
      />
    );
    return loading ? (
      <Skeleton variant="circular" className={props.className}>
        {fab}
      </Skeleton>
    ) : (
      fab
    );
  }
);
