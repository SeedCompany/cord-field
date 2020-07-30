import { ListItem, ListItemProps } from '@material-ui/core';
import clsx from 'clsx';
import React, { forwardRef, Ref } from 'react';
import { Link, NavLinkProps, useMatch } from 'react-router-dom';
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

interface InternalProps extends Merge<BaseProps, NavLinkProps> {
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
  ({ external, to, children, exact = false, ...props }, ref) => {
    const path = typeof to === 'string' ? to : to.pathname!;
    const active = useMatch({ path, end: exact });

    if (external) {
      assert(typeof to === 'string');
      // Types are all messed up, but this works.
      const liProps: any = {
        ...props,
        href: to,
        button: true,
        ref: ref,
        component: 'a',
      };
      return <ListItem {...liProps}>{children}</ListItem>;
    }

    const { activeStyle, activeClassName } = props as InternalProps;
    return (
      <ListItem
        selected={Boolean(active)}
        {...props}
        to={to}
        button
        ref={ref as Ref<HTMLDivElement>}
        component={Link as any}
        aria-current={active ? props['aria-current'] ?? 'page' : undefined}
        style={{ ...props.style, ...(active ? activeStyle : null) }}
        className={clsx(props.className, active && activeClassName)}
      >
        {children}
      </ListItem>
    );
  }
);
