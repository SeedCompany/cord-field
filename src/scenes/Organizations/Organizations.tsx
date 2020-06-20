import React from 'react';
import { useRoutes } from 'react-router-dom';
import { OrganizationDetail } from './Detail';
import { OrganizationList } from './List';

export const Organizations = () => {
  const matched = useRoutes([
    {
      path: '/',
      element: <OrganizationList />,
    },
    {
      path: '/:orgId',
      element: <OrganizationDetail />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
