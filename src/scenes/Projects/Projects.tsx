import React from 'react';
import { useRoutes } from 'react-router-dom';
import { PartnershipList } from '../Partnerships/List';
import { ProjectFilesList } from './Files';
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
      path: ':projectId/files',
      element: <ProjectFilesList />,
    },
    {
      path: ':projectId/members',
      element: <ProjectMembersList />,
    },
    {
      path: ':projectId/partnerships',
      element: <PartnershipList />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
