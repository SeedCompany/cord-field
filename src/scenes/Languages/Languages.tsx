import React from 'react';
import { useRoutes } from 'react-router-dom';
import { LanguageList } from './List';
import { LanguageOverview } from './Overview';

export const Languages = () => {
  const matched = useRoutes([
    {
      path: '/',
      element: <LanguageList />,
    },
    {
      path: '/:languageId',
      element: <LanguageOverview />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
