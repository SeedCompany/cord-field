import { Typography } from '@material-ui/core';
import { To } from 'history';
import { isString } from 'lodash';
import { forwardRef, ReactNode } from 'react';
import * as React from 'react';
import { useMatch } from 'react-router-dom';
import { Link, LinkProps } from '../Routing';

export interface BreadcrumbProps {
  to?: To;
  LinkProps?: Partial<LinkProps>;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Breadcrumb = forwardRef<HTMLAnchorElement, BreadcrumbProps>(
  ({ to, children, LinkProps, ...rest }, ref) => {
    const active =
      useMatch(to == null ? '' : isString(to) ? to : to.pathname!) ||
      // RR doesn't think current page is active. maybe a bug?
      to === '.';

    if (to == null || active) {
      return (
        <Typography variant="h4" {...rest} ref={ref}>
          {children}
        </Typography>
      );
    } else {
      return (
        <Link variant="h4" to={to} {...LinkProps} {...rest} ref={ref}>
          {children}
        </Link>
      );
    }
  }
);
