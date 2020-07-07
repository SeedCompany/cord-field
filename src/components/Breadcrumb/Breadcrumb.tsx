import { Typography } from '@material-ui/core';
import { PathPieces } from 'history';
import { isString } from 'lodash';
import { FC } from 'react';
import * as React from 'react';
import { useMatch } from 'react-router-dom';
import { Link, LinkProps } from '../Routing';

export interface BreadcrumbProps {
  to: string | PathPieces;
  LinkProps?: Partial<LinkProps>;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  to,
  children,
  LinkProps,
}) => {
  const active =
    useMatch(isString(to) ? to : to.pathname!) ||
    // RR doesn't think current page is active. maybe a bug?
    to === '.';

  if (active) {
    return <Typography variant="h4">{children}</Typography>;
  } else {
    return (
      <Link variant="h4" to={to} {...LinkProps}>
        {children}
      </Link>
    );
  }
};
