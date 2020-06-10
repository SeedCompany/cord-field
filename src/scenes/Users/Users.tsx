import React from 'react';
import { useRoutes } from 'react-router-dom';
import { UserDetail } from './Detail';
import { UserList } from './List';

export const Users = () => {
  const matched = useRoutes([
    {
      path: '/',
      element: <UserList />,
    },
    {
      path: '/:userId',
      element: <UserDetail />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
