import { ListItemButton, ListItemButtonProps } from '@mui/material';
import { many, Many } from '@seedcompany/common';
import { forwardRef, useMemo } from 'react';
import {
  // eslint-disable-next-line @seedcompany/no-restricted-imports
  Link,
  // eslint-disable-next-line @seedcompany/no-restricted-imports
  LinkProps,
  matchPath,
  PathPattern,
  useLocation,
} from 'react-router-dom';
import { Merge } from 'type-fest';

export type ListItemLinkProps = InternalProps | ExternalProps;

type BaseProps = Omit<ListItemButtonProps<'a'>, 'component'> & {
  /**
   * Whether the active styles should ONLY be applied for paths
   * that exactly match the given one
   */
  // exact?: boolean;
  /**
   * Whether the active styles should be applied.
   */
  active?: Many<string | PathPattern>;
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
    { external, to, children, active: activePatterns, ...props },
    ref
  ) {
    const path = typeof to === 'string' ? to : to.pathname!;
    const { pathname } = useLocation();
    const active = useMemo(
      () =>
        many(activePatterns ?? { path, end: false }).some((pattern) =>
          matchPath<any, string>(pattern, pathname)
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [pathname]
    );
    return (
      <ListItemButton
        selected={active}
        {...props}
        ref={ref}
        {...(external ? { href: to } : { to })}
        component={external ? 'a' : Link}
        aria-current={active ? props['aria-current'] ?? 'page' : undefined}
      >
        {children}
      </ListItemButton>
    );
  }
);
