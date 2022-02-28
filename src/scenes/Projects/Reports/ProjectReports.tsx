import { useQuery } from '@apollo/client';
import React from 'react';
import { ReportType } from '../../../api';
import { Error } from '../../../components/Error';
import { FinancialReportCheckList } from '../../../components/PeriodicReports/FinancialReportCheckList';
import { PeriodicReportsList } from '../../../components/PeriodicReports/PeriodicReportsList';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ProjectOverviewDocument } from '../Overview/ProjectOverview.generated';
import { useProjectId } from '../useProjectId';
import {
  FinancialReportsDocument,
  NarrativeReportsDocument,
} from './ProjectReports.generated';

export const ProjectReports = ({ type }: { type: ReportType }) => {
  const { projectId, changesetId } = useProjectId();
  const { data, error } = useQuery(
    type === 'Financial' ? FinancialReportsDocument : NarrativeReportsDocument,
    {
      variables: { projectId, changeset: changesetId },
    }
  );
  const { data: projectOverviewData } = useQuery(ProjectOverviewDocument, {
    variables: {
      input: projectId,
      changeset: changesetId,
    },
  });

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
      children={
        type === 'Financial' &&
        projectOverviewData?.project.financialReports.total === 0 ? (
          <FinancialReportCheckList project={projectOverviewData.project} />
        ) : null
      }
    />
  );
};
