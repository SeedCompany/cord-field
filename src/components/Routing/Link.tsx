// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link as MUILink, LinkProps as MUILinkProps } from '@mui/material';
import { forwardRef } from 'react';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom';
import { Merge } from 'type-fest';

export type LinkProps = InternalProps | ExternalProps;

type BaseProps = Omit<MUILinkProps, 'component' | 'href'>;

interface InternalProps extends Merge<BaseProps, RRLinkProps> {
  external?: false;
}

interface ExternalProps extends BaseProps {
  external: true;
  to: string;
}

/**
 * A Link to somewhere.
 *
 * Combines MUI Link with react router for internal routing
 * and <a> for external routing.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { external, to, children, ...props },
  ref
) {
  const other: any = {
    ref,
    component: external ? 'a' : RRLink,
    ...(external ? { href: to } : { to }),
  };

  return (
    <MUILink {...props} {...other}>
      {children}
    </MUILink>
  );
});
