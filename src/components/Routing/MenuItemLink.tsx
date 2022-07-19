import { MenuItem, MenuItemProps } from '@material-ui/core';
import { forwardRef } from 'react';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps } from 'react-router-dom';
import { assert } from 'ts-essentials';
import { Merge } from 'type-fest';

export type MenuItemLinkProps = InternalProps | ExternalProps;

type BaseProps = Omit<MenuItemProps<'a'>, 'button' | 'component' | 'href'>;

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
    if (external) {
      assert(typeof to === 'string');
      return (
        <MenuItem {...props} href={to} button ref={ref} component="a">
          {children}
        </MenuItem>
      );
    }

    return (
      <MenuItem {...props} to={to} button ref={ref} component={Link}>
        {children}
      </MenuItem>
    );
  }
);
