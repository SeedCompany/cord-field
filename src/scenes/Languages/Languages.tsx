import React from 'react';
import { useRoutes } from 'react-router-dom';
import { LanguageDetail } from './Detail';
import { LanguageList } from './List';

export const Languages = () => {
  const matched = useRoutes([
    {
      path: '/',
      element: <LanguageList />,
    },
    {
      path: '/:languageId',
      element: <LanguageDetail />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
