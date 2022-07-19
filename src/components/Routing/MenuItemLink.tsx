import { MenuItem, MenuItemProps } from '@mui/material';
import { forwardRef } from 'react';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps } from 'react-router-dom';
import { Merge } from 'type-fest';

export type MenuItemLinkProps = InternalProps | ExternalProps;

type BaseProps = Omit<MenuItemProps<'a'>, 'component' | 'href'>;

interface InternalProps extends Merge<BaseProps, LinkProps> {
  external?: false;
}

interface ExternalProps extends BaseProps {
  external: true;
  to: string;
}

/**
 * A MenuItem linking to somewhere.
 *
 * Uses `Link` for internal routing and `<a>` for external routing.
 */
export const MenuItemLink = forwardRef<HTMLAnchorElement, MenuItemLinkProps>(
  function MenuItemLink({ external, to, children, ...props }, ref) {
    return (
      <MenuItem
        {...props}
        ref={ref}
        {...(external ? { href: to } : { to })}
        component={external ? 'a' : Link}
      >
        {children}
      </MenuItem>
    );
  }
);
