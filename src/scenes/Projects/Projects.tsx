import React from 'react';
import { useRoutes } from 'react-router-dom';
import { PartnershipList } from '../Partnerships/List';
import { ProjectList } from './List';
import { ProjectMembersList } from './Members/List';
import { ProjectOverview } from './Overview';

export const Projects = () => {
  const matched = useRoutes([
    {
      path: '',
      element: <ProjectList />,
    },
    {
      path: ':projectId',
      element: <ProjectOverview />,
    },
    {
      path: ':projectId/partnerships',
      element: <PartnershipList />,
    },
    {
      path: ':projectId/members',
      element: <ProjectMembersList />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
