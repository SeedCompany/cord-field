import { useQuery } from '@apollo/client';
import { useChangesetAwareIdFromUrl } from '../../../components/Changeset';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { Error } from '../../../components/Error';
import { PeriodicReportsList as PeriodicReportListLayout } from '../../../components/PeriodicReports';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ProgressReportsOfEngagementDocument as ReportsOfEngagement } from './ProgressReportsOfEngagement.graphql';
import { ProgressReportsTable } from './ProgressReportsTable';

export const ProgressReportListPage = () => {
  const { id: engagementId, changesetId } =
    useChangesetAwareIdFromUrl('engagementId');
  const { data, error } = useQuery(ReportsOfEngagement, {
    variables: {
      engagementId,
      changeset: changesetId,
    },
  });

  if (error) {
    return (
      <Error page error={error}>
        {{
          NotFound: 'Could not find engagement',
          Default: 'Error loading progress reports',
        }}
      </Error>
    );
  }

  const engagement =
    data?.engagement.__typename === 'LanguageEngagement'
      ? data.engagement
      : undefined;

  return (
    <PeriodicReportListLayout
      type="Progress"
      pageTitleSuffix={engagement?.project.name.value ?? 'A Project'}
      breadcrumbs={[
        <ProjectBreadcrumb key="project" data={engagement?.project} />,
        <EngagementBreadcrumb key="engagement" data={engagement} />,
      ]}
    >
      <ProgressReportsTable
        loading={!engagement}
        rows={engagement?.progressReports.items ?? []}
      />
    </PeriodicReportListLayout>
  );
};
