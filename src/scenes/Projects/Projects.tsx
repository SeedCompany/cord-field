import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Engagement } from '../Engagement';
import { PartnershipList } from '../Partnerships/List';
import { ProjectBudget } from './Budget';
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
      path: ':projectId/files/:folderId',
      element: <ProjectFilesList />,
    },
    {
      path: ':projectId/members',
      element: <ProjectMembersList />,
    },
    {
      path: ':projectId/engagements/:engagementId',
      element: <Engagement />,
    },
    {
      path: ':projectId/partnerships',
      element: <PartnershipList />,
    },
    {
      path: '/:projectId/budget',
      element: <ProjectBudget />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
