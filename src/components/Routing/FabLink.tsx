import { Fab, FabProps as MUIFabProps, Skeleton } from '@mui/material';
import { forwardRef } from 'react';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps } from 'react-router-dom';
import { FabProps as OurFabProps } from '../Fab';

export type FabLinkProps = Omit<MUIFabProps<typeof Link, LinkProps>, 'href'> &
  Pick<OurFabProps, 'loading'>;

export const FabLink = forwardRef<HTMLAnchorElement, FabLinkProps>(
  function FabLink({ loading, ...props }, ref) {
    const fab = <Fab {...props} component={Link} ref={ref} />;
    return loading ? <Skeleton variant="circular">{fab}</Skeleton> : fab;
  }
);
