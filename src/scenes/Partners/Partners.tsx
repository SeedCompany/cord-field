import React from 'react';
import { useRoutes } from 'react-router-dom';
import { PartnerList } from './List';

export const Partners = () => {
  const matched = useRoutes([
    {
      path: '/',
      element: <PartnerList />,
    },
    // {
    //   path: '/:partnerId',
    //   element: <PartnerDetail />,
    // },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
