import { Button, ButtonProps } from '@mui/material';
import { forwardRef } from 'react';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps } from 'react-router-dom';
import { Merge } from 'type-fest';

export type ButtonLinkProps = InternalProps | ExternalProps;

type BaseProps = Omit<ButtonProps<'a'>, 'component' | 'href'>;

interface InternalProps extends Merge<BaseProps, LinkProps> {
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
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink({ external, to, children, ...props }, ref) {
    const other: any = {
      ref,
      component: external ? 'a' : Link,
      ...(external ? { href: to } : { to }),
    };
    return (
      <Button {...props} {...other}>
        {children}
      </Button>
    );
  }
);
