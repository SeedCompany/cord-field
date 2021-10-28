import { useQuery } from '@apollo/client';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { Error } from '../../../../components/Error';
import { PeriodicReportsList } from '../../../../components/PeriodicReports';
import { ReportRow } from '../../../../components/PeriodicReports/PeriodicReportsTable';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../../components/Redacted';
import { useProjectId } from '../../../Projects/useProjectId';
import { ProgressReportsDocument } from './ProgressReportList.generated';

export const ProgressReportsList = () => {
  const { projectId, changesetId, projectUrl } = useProjectId();
  const { engagementId = '' } = useParams();
  const { data, error } = useQuery(ProgressReportsDocument, {
    variables: {
      projectId,
      changeset: changesetId,
      engagementId,
    },
  });
  const navigate = useNavigate();
  const engagementUrl = data
    ? `${projectUrl}/engagements/${data.engagement.id}`
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
  const language = engagement?.language.value;
  const languageName = language?.name.value ?? language?.displayName.value;

  const handleRowClick = (row: ReportRow) => {
    navigate(`${engagementUrl}/reports/progress/${row.report.id}`);
  };

  return (
    <PeriodicReportsList
      type="Progress"
      pageTitleSuffix={data?.project.name.value ?? 'A Project'}
      breadcrumbs={[
        <ProjectBreadcrumb data={data?.project} />,
        <Breadcrumb
          to={data ? `${projectUrl}/engagements/${data.engagement.id}` : '.'}
        >
          {!data ? (
            <Skeleton width={200} />
          ) : languageName ? (
            languageName
          ) : (
            <Redacted
              info="You do not have permission to view this engagement's name"
              width={200}
            />
          )}
        </Breadcrumb>,
      ]}
      reports={engagement?.progressReports.items}
      onRowClick={handleRowClick}
    />
  );
};
