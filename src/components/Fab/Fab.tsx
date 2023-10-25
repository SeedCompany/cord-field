import {
  Fab as MUIFab,
  FabProps as MUIFabProps,
  Skeleton,
} from '@mui/material';
import { forwardRef } from 'react';

export type FabProps = MUIFabProps & {
  loading?: boolean;
};

export const Fab = forwardRef<HTMLButtonElement, FabProps>(function Fab(
  { loading, ...props },
  ref
) {
  const fab = <MUIFab ref={ref} {...props} />;
  return loading ? <Skeleton variant="circular">{fab}</Skeleton> : fab;
});
