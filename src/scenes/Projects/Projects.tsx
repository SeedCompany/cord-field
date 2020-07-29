import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Engagement } from '../Engagement';
import { PartnershipList } from '../Partnerships/List';
import { CreateProduct } from '../Products/Create';
import { EditProduct } from '../Products/Edit';
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
    {
      path: ':projectId/engagements/:engagementId/create-product',
      element: <CreateProduct />,
    },
    {
      path: ':projectId/engagements/:engagementId/products/:productId',
      element: <EditProduct />,
    },
  ]);

  if (!matched) {
    return <div>Not Found</div>;
  }

  return <>{matched}</>;
};
