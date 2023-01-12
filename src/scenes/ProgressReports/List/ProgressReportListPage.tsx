import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  idForUrl,
  useChangesetAwareIdFromUrl,
} from '../../../components/Changeset';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { Error } from '../../../components/Error';
import { PeriodicReportsList } from '../../../components/PeriodicReports';
import { PeriodicReportFragment } from '../../../components/PeriodicReports/PeriodicReport.graphql';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ProgressReportsDocument } from './ProgressReportList.graphql';

export const ProgressReportListPage = () => {
  const { id: engagementId, changesetId } =
    useChangesetAwareIdFromUrl('engagementId');
  const { data, error } = useQuery(ProgressReportsDocument, {
    variables: {
      engagementId,
      changeset: changesetId,
    },
  });
  const navigate = useNavigate();

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

  const handleRowClick = (report: PeriodicReportFragment) => {
    navigate(`/progress-reports/${idForUrl(report)}`);
  };

  return (
    <PeriodicReportsList
      type="Progress"
      pageTitleSuffix={engagement?.project.name.value ?? 'A Project'}
      breadcrumbs={[
        <ProjectBreadcrumb key="project" data={engagement?.project} />,
        <EngagementBreadcrumb key="engagement" data={engagement} />,
      ]}
      reports={engagement?.progressReports.items}
      onRowClick={handleRowClick}
    />
  );
};
