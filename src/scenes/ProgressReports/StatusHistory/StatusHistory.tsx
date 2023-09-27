import { useQuery } from '@apollo/client';
import {
  Box,
  Breadcrumbs,
  FormControlLabel,
  Skeleton,
  Switch,
  Typography,
} from '@mui/material';
import { useToggle } from 'ahooks';
import { Helmet } from 'react-helmet-async';
import { flexColumn } from '~/common';
import { Breadcrumb } from '~/components/Breadcrumb';
import { useChangesetAwareIdFromUrl } from '~/components/Changeset';
import { EngagementBreadcrumb } from '~/components/EngagementBreadcrumb';
import { getReportLabel } from '~/components/PeriodicReports/ReportLabel';
import { ProgressReportBreadcrumb } from '~/components/ProgressReportBreadcrumb';
import { ProgressReportListBreadcrumb } from '~/components/ProgressReportListBreadcrumb';
import { ProjectBreadcrumb } from '~/components/ProjectBreadcrumb';
import { Navigate } from '~/components/Routing';
import { Error } from '../../../components/Error';
import {
  ProgressReportDetailDocument,
  ProgressReportDetailFragment,
} from '../Detail/ProgressReportDetail.graphql';
import { WorkFlowEventList } from './WorkflowEventList';

export const StatusHistory = () => {
  const { id, changesetId } = useChangesetAwareIdFromUrl('reportId');
  const [showNotes, setShowNotes] = useToggle(true);

  const { data, error } = useQuery(ProgressReportDetailDocument, {
    variables: {
      id,
      changesetId,
    },
  });
  if (error) {
    return (
      <Error page error={error}>
        {{
          NotFound: 'Could not find quarterly report',
          Default: "Error loading quarterly report's status history",
        }}
      </Error>
    );
  }

  const report = data?.periodicReport as
    | ProgressReportDetailFragment
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- safety check. It's possible with manual user input.
  if (report && report.__typename !== 'ProgressReport') {
    return <Navigate to="/" replace />;
  }

  const engagement = report?.parent;

  const reportTitle = getReportLabel(report);
  const engagementTitle =
    engagement?.language.value?.name.value ??
    engagement?.language.value?.displayName.value;

  return (
    <Box
      component="main"
      css={flexColumn}
      sx={{ p: 4, gap: 2, overflowY: 'auto' }}
    >
      <Helmet
        title={
          !report ? 'Status History' : `${reportTitle} - ${engagementTitle}`
        }
      />
      <Breadcrumbs
        children={[
          <ProjectBreadcrumb key="project" data={engagement?.project} />,
          <EngagementBreadcrumb key="engagement" data={engagement} />,
          <ProgressReportListBreadcrumb
            key="report-list"
            engagement={engagement}
          />,
          <ProgressReportBreadcrumb data={report} key="report" />,
          <Breadcrumb key="status-history" to=".">
            {!report ? <Skeleton width={200} /> : 'Status History'}
          </Breadcrumb>,
        ]}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h3">
          Status History
        </Typography>
        <FormControlLabel
          control={
            <Switch checked={showNotes} onChange={setShowNotes.toggle} />
          }
          label="Show Notes"
          labelPlacement="start"
          sx={{ gap: 1 }}
        />
      </Box>
      <WorkFlowEventList
        events={report?.workflowEvents}
        showNotes={showNotes}
      />
    </Box>
  );
};
