import React from 'react';
import { useRoutes } from 'react-router-dom';
import { UserList } from './List';

export const Users = () => {
  const matched = useRoutes([
    {
      path: '/',
      element: <UserList />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
