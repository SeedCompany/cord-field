import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ProjectList } from './List';
import { ProjectOverview } from './Overview';

export const Projects = () => {
  const matched = useRoutes([
    {
      path: '/',
      element: <ProjectList />,
    },
    {
      path: '/:projectId',
      element: <ProjectOverview />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
