import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ReportType } from '../../../api';
import { Error } from '../../../components/Error';
import { PeriodicReportsList } from '../../../components/PeriodicReports/PeriodicReportsList';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import {
  FinancialReportsDocument,
  NarrativeReportsDocument,
} from './ProjectReports.generated';

export const ProjectReports = ({ type }: { type: ReportType }) => {
  const { projectId = '' } = useParams();
  const { data, error } = useQuery(
    type === 'Financial' ? FinancialReportsDocument : NarrativeReportsDocument,
    {
      variables: { projectId },
    }
  );

  if (error) {
    return (
      <Error page error={error}>
        {{
          NotFound: 'Could not find project or engagement',
          Default: 'Error loading progress reports',
        }}
      </Error>
    );
  }

  return (
    <PeriodicReportsList
      type={type}
      reports={data?.project.reports.items}
      breadcrumbs={[<ProjectBreadcrumb data={data?.project} />]}
      pageTitleSuffix={data?.project.name.value ?? 'A Project'}
    />
  );
};
