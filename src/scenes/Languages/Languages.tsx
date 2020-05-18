import React from 'react';
import { useRoutes } from 'react-router-dom';
import { LanguageList } from './List';

export const Languages = () => {
  const matched = useRoutes([
    {
      path: '/',
      element: <LanguageList />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
