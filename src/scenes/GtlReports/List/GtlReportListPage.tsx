import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { Error } from '../../../components/Error';
import { PeriodicReportsList as PeriodicReportListLayout } from '../../../components/PeriodicReports';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { GtlReportsOfEngagementDocument } from './GtlReportsOfEngagement.graphql';
import { GtlReportsTable } from './GtlReportsTable';

/**
 * Every quarterly report for one Global Translation Leader engagement.
 *
 * The engagement page shows only the report currently due, which is the common
 * case; this is where someone goes to find an older quarter.
 */
export const GtlReportListPage = () => {
  const { engagementId = '' } = useParams();
  const { data, error } = useQuery(GtlReportsOfEngagementDocument, {
    variables: { engagementId },
  });

  if (error) {
    return (
      <Error page error={error}>
        {{
          NotFound: 'Could not find engagement',
          Default: 'Error loading reports',
        }}
      </Error>
    );
  }

  const engagement =
    data?.engagement.__typename === 'InternshipEngagement'
      ? data.engagement
      : undefined;

  return (
    <PeriodicReportListLayout
      type="GTL"
      pageTitleSuffix={engagement?.project.name.value ?? 'A Project'}
      breadcrumbs={[
        <ProjectBreadcrumb key="project" data={engagement?.project} />,
        <EngagementBreadcrumb key="engagement" data={engagement} />,
      ]}
      TableCardProps={{ sx: { maxWidth: 560 } }}
    >
      <GtlReportsTable
        loading={!engagement}
        rows={engagement?.gtlReports.items ?? []}
      />
    </PeriodicReportListLayout>
  );
};
