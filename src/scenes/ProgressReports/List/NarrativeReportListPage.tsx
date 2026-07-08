import { useQuery } from '@apollo/client';
import { PeriodicReportsTable } from '~/components/PeriodicReports/PeriodicReportsTable';
import { useChangesetAwareIdFromUrl } from '../../../components/Changeset';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { Error } from '../../../components/Error';
import { PeriodicReportsList as PeriodicReportListLayout } from '../../../components/PeriodicReports';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ProgressReportsOfEngagementDocument as ReportsOfEngagement } from './ProgressReportsOfEngagement.graphql';

export const NarrativeReportListPage = () => {
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
          Default: 'Error loading narrative reports',
        }}
      </Error>
    );
  }

  const engagement =
    data?.engagement.__typename === 'LanguageEngagement'
      ? data.engagement
      : undefined;

  const isMultiplication =
    engagement?.project.__typename === 'MultiplicationTranslationProject';

  if (engagement && !isMultiplication) {
    return (
      <Error page>
        {{
          Default: 'Narrative reports are not available for this engagement',
        }}
      </Error>
    );
  }

  return (
    <PeriodicReportListLayout
      type="Narrative"
      pageTitleSuffix={engagement?.project.name.value ?? 'A Project'}
      breadcrumbs={[
        <ProjectBreadcrumb key="project" data={engagement?.project} />,
        <EngagementBreadcrumb key="engagement" data={engagement} />,
      ]}
    >
      <PeriodicReportsTable
        fileField="narrativeFile"
        data={engagement?.progressReports.items}
      />
    </PeriodicReportListLayout>
  );
};
