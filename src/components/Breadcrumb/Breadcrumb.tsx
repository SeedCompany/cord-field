import { Typography } from '@material-ui/core';
import { PathPieces } from 'history';
import { FC } from 'react';
import * as React from 'react';
import { useMatch } from 'react-router-dom';
import { Link } from '../Routing';

export interface BreadcrumbProps {
  to: string | PathPieces;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ to, children }) => {
  const path = typeof to === 'string' ? to : { path: to.pathname! };
  const active = useMatch(path);

  if (active) {
    return <Typography variant="h4">{children}</Typography>;
  } else {
    return (
      <Link variant="h4" to={to}>
        {children}
      </Link>
    );
  }
};
