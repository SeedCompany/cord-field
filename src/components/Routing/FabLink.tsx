import { FabProps as MUIFabProps } from '@mui/material';
import { forwardRef } from 'react';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps } from 'react-router-dom';
import { Fab, FabProps as OurFabProps } from '../Fab';

export type FabLinkProps = MUIFabProps<typeof Link, LinkProps> &
  Pick<OurFabProps, 'loading'>;

export const FabLink = forwardRef<HTMLAnchorElement, FabLinkProps>(
  function FabLink(props, ref) {
    return (
      <Fab
        {...props}
        // @ts-expect-error some TS wrapper is make this type crap out
        component={Link}
        ref={ref as any}
      />
    );
  }
);
