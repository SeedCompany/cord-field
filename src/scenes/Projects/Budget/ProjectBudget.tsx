import { Breadcrumbs, Typography } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/Layout/ContentContainer';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { useProjectBudgetQuery } from './ProjectBudget.generated';
import { ProjectBudgetRecords } from './ProjectBudgetRecords';

export const ProjectBudget = () => {
  const { projectId } = useParams();

  const { data, loading, error } = useProjectBudgetQuery({
    variables: { id: projectId },
  });

  const budget = data?.project.budget;

  return (
    <Content>
      {error ? (
        <Typography variant="h4">Error fetching Project Budget</Typography>
      ) : budget?.canRead === false ? (
        <Typography variant="h4">
          You do not have permission to view this project's budget
        </Typography>
      ) : (
        <>
          <Breadcrumbs>
            <ProjectBreadcrumb data={data?.project} />
            <Breadcrumb to=".">Field Budget</Breadcrumb>
          </Breadcrumbs>
          <ProjectBudgetRecords loading={loading} budget={budget} />
        </>
      )}
    </Content>
  );
};
