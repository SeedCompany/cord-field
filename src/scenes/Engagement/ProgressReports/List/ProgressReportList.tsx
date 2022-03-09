import { useQuery } from '@apollo/client';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  idForUrl,
  useChangesetAwareIdFromUrl,
} from '../../../../components/Changeset';
import { EngagementBreadcrumb } from '../../../../components/EngagementBreadcrumb';
import { Error } from '../../../../components/Error';
import { PeriodicReportsList } from '../../../../components/PeriodicReports';
import { ReportRow } from '../../../../components/PeriodicReports/PeriodicReportsTable';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { ProgressReportsDocument } from './ProgressReportList.generated';

export const ProgressReportsList = () => {
  const { id: engagementId, changesetId } =
    useChangesetAwareIdFromUrl('engagementId');
  const { data, error } = useQuery(ProgressReportsDocument, {
    variables: {
      engagementId,
      changeset: changesetId,
    },
  });
  const navigate = useNavigate();
  const engagementUrl = data
    ? `/engagements/${idForUrl(data.engagement)}`
    : '.';

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

  const engagement =
    data?.engagement.__typename === 'LanguageEngagement'
      ? data.engagement
      : undefined;

  const handleRowClick = (row: ReportRow) => {
    navigate(`${engagementUrl}/reports/progress/${row.report.id}`);
  };

  return (
    <PeriodicReportsList
      type="Progress"
      pageTitleSuffix={engagement?.project.name.value ?? 'A Project'}
      breadcrumbs={[
        <ProjectBreadcrumb data={engagement?.project} />,
        <EngagementBreadcrumb data={engagement} />,
      ]}
      reports={engagement?.progressReports.items}
      onRowClick={handleRowClick}
    />
  );
};
