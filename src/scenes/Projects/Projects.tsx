import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ProjectList } from './ProjectList';

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
  return <div>{matched}</div>;
};
