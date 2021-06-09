import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ReportType } from '../../../api';
import { PeriodicReportsList } from '../../../components/PeriodicReports/PeriodicReportsList';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import {
  FinancialReportsDocument,
  NarrativeReportsDocument,
} from './ProjectReports.generated';

export const ProjectReports = ({ type }: { type: ReportType }) => {
  const { projectId = '' } = useParams();
  const { data } = useQuery(
    type === 'Financial' ? FinancialReportsDocument : NarrativeReportsDocument,
    {
      variables: { projectId },
    }
  );

  return (
    <PeriodicReportsList
      type={type}
      reports={data?.project.reports.items}
      breadcrumbs={[<ProjectBreadcrumb data={data?.project} />]}
      pageTitleSuffix={data?.project.name.value ?? 'A Project'}
    />
  );
};
