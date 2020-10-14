import React from 'react';
import { useRoutes } from 'react-router-dom';
import { LocationDetail } from './Detail';

export const Locations = () => {
  const matched = useRoutes([
    {
      path: '/:locationId',
      element: <LocationDetail />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
