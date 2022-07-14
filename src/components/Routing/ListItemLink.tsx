import { ListItem, ListItemProps } from '@mui/material';
import { forwardRef } from 'react';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps, useMatch } from 'react-router-dom';
import { assert } from 'ts-essentials';
import { Merge } from 'type-fest';

export type ListItemLinkProps = InternalProps | ExternalProps;

type BaseProps = Omit<ListItemProps<'a'>, 'button' | 'component' | 'href'> & {
  /**
   * Whether the active styles should ONLY be applied for paths
   * that exactly match the given one
   */
  exact?: boolean;
};

interface InternalProps extends Merge<BaseProps, LinkProps> {
  external?: false;
}

interface ExternalProps extends BaseProps {
  external: true;
  to: string;
}

/**
 * A ListItem linking to somewhere.
 *
 * Uses react-router `Link` for internal routing and `<a>` for external routing.
 *
 * Instead of using `NavLink` here we just set `selected={true}` if current path
 * matches since that's more idiomatic with the component. This can be disabled
 * by passing in `selected={false}`.
 */
export const ListItemLink = forwardRef<HTMLAnchorElement, ListItemLinkProps>(
  function ListItemLink(
    { external, to, children, exact = false, ...props },
    ref
  ) {
    const path = typeof to === 'string' ? to : to.pathname!;
    const active = useMatch({ path, end: exact });

    if (external) {
      assert(typeof to === 'string');
      return (
        <ListItem {...props} href={to} button ref={ref} component="a">
          {children}
        </ListItem>
      );
    }

    return (
      <ListItem
        selected={Boolean(active)}
        {...props}
        to={to}
        button
        ref={ref}
        component={Link}
        aria-current={active ? props['aria-current'] ?? 'page' : undefined}
      >
        {children}
      </ListItem>
    );
  }
);
