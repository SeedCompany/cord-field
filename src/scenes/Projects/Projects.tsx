import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ProjectList } from './List';

export const Projects = () => {
  const matched = useRoutes([
    {
      path: '/',
      element: <ProjectList />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
