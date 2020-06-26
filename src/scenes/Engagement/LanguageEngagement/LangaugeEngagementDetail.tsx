import { Breadcrumbs, IconButton, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { PencilCircledIcon } from '../../../components/Icons';
import {
  LanguageEngagementDetailFragment,
  ProjectBreadcrumbFragment,
} from './LanguageEngagementDetail.generated';

interface LanguageEngagementDetailProps {
  engagement: LanguageEngagementDetailFragment;
  project: ProjectBreadcrumbFragment;
}

export const LanguageEngagementDetail: FC<LanguageEngagementDetailProps> = ({
  project,
}) => {
  return (
    <main>
      <Breadcrumbs>
        <Breadcrumb to={`/projects`}>Projects</Breadcrumb>
        <Breadcrumb to={`/projects/${project.id}`}>
          {project.name.value ?? <Skeleton width={200} />}
        </Breadcrumb>
      </Breadcrumbs>
      <Typography variant="h2">
        {/* TODO: when name query fixed show real name */}
        Placeholder Name
        <IconButton color="primary" aria-label="edit partner">
          <PencilCircledIcon />
        </IconButton>
      </Typography>
    </main>
  );
};
