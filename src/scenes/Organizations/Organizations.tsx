import React from 'react';
import { useRoutes } from 'react-router-dom';
import { OrganizationList } from './List';

export const Organizations = () => {
  const matched = useRoutes([
    {
      path: '/',
      element: <OrganizationList />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
