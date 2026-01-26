import { useQuery } from '@apollo/client';
import { PeriodicReportsTable } from '~/components/PeriodicReports/PeriodicReportsTable';
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
      TableCardProps={{
        sx: {
          maxWidth:
            engagement?.project.__typename !==
            'MultiplicationTranslationProject'
              ? 400
              : undefined,
        },
      }}
    >
      {engagement?.project.__typename === 'MultiplicationTranslationProject' ? (
        <PeriodicReportsTable data={engagement.progressReports.items} />
      ) : (
        <ProgressReportsTable
          loading={!engagement}
          rows={engagement?.progressReports.items ?? []}
        />
      )}
    </PeriodicReportListLayout>
  );
};
