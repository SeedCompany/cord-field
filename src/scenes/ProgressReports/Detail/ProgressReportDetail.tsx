import { useQuery } from '@apollo/client';
import { Edit, SkipNextRounded as SkipIcon } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useBetaFeatures } from '~/components/Session';
import { Breadcrumb } from '../../../components/Breadcrumb';
import {
  idForUrl,
  useChangesetAwareIdFromUrl,
} from '../../../components/Changeset';
import { useDialog } from '../../../components/Dialog';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { Error } from '../../../components/Error';
import { Fab } from '../../../components/Fab';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { FormattedDate } from '../../../components/Formatters';
import { IconButton } from '../../../components/IconButton';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { SkipPeriodicReportDialog } from '../../Projects/Reports/SkipPeriodicReportDialog';
import { UpdatePeriodicReportDialog } from '../../Projects/Reports/UpdatePeriodicReportDialog';
import { NewProgressReportCard } from './NewProgressReportCard';
import { ProductTableList } from './ProductTableList';
import { ProgressReportCard } from './ProgressReportCard';
import { ProgressReportDetailDocument } from './ProgressReportDetail.graphql';
import { ProgressReportDrawer } from './ProgressReportDrawer';
import { ProgressSummaryCard } from './ProgressSummaryCard';

export const ProgressReportDetail = () => {
  const { id, changesetId } = useChangesetAwareIdFromUrl('reportId');

  const beta = useBetaFeatures();
  const newProgressReportBeta = beta.has('newProgressReports');

  // Single file for new version, empty array for received date update.
  const [dialogState, setUploading, upload] = useDialog<File[]>();
  const [skipState, openSkip] = useDialog();

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
          NotFound: 'Could not find progress report',
          Default: 'Error loading progress report',
        }}
      </Error>
    );
  }

  const report =
    data?.periodicReport.__typename === 'ProgressReport'
      ? data.periodicReport
      : null;
  const engagement = report?.parent;

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="main"
        sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column' }}
      >
        <Helmet title="Progress Report" />
        <Breadcrumbs
          children={[
            <ProjectBreadcrumb key="project" data={engagement?.project} />,
            <EngagementBreadcrumb key="engagement" data={engagement} />,
            <Breadcrumb
              key="report-list"
              to={
                engagement
                  ? `/engagements/${idForUrl(engagement)}/reports/progress`
                  : undefined
              }
            >
              {!report ? <Skeleton width={200} /> : 'Progress Reports'}
            </Breadcrumb>,
            <Breadcrumb key="report" to=".">
              {!report ? (
                <Skeleton width={200} />
              ) : (
                <ReportLabel report={report} />
              )}
            </Breadcrumb>,
          ]}
        />

        <Grid container spacing={3} alignItems="center" sx={{ mt: 3, mb: 2 }}>
          <Grid item component={Typography} variant="h2">
            {data ? (
              <>
                Progress Report - <ReportLabel report={report} />
              </>
            ) : (
              <Skeleton width={442} />
            )}
          </Grid>
          {(!report || report.receivedDate.canEdit) && (
            <Grid item>
              <Tooltip title="Update received date">
                <Fab
                  color="primary"
                  aria-label="Update report"
                  loading={!report}
                  onClick={() => setUploading([])}
                >
                  <Edit />
                </Fab>
              </Tooltip>
              {report && (
                <UpdatePeriodicReportDialog
                  {...dialogState}
                  report={{ ...report, reportFile: upload }}
                  editFields={[
                    'receivedDate',
                    ...(upload && upload.length > 0
                      ? ['reportFile' as const]
                      : []),
                  ]}
                />
              )}
            </Grid>
          )}
          {(!report || report.skippedReason.canEdit) && (
            <Grid item>
              <Tooltip
                title={
                  report?.skippedReason.value
                    ? 'Edit Skipped Reason'
                    : 'Skip Report'
                }
              >
                <IconButton
                  aria-label="Skip report"
                  loading={!report}
                  onClick={openSkip}
                >
                  <SkipIcon />
                </IconButton>
              </Tooltip>
              {report && (
                <SkipPeriodicReportDialog {...skipState} report={report} />
              )}
            </Grid>
          )}
        </Grid>

        {report?.skippedReason.value ? (
          <Grid container direction="column" spacing={2} maxWidth="sm">
            <Grid item component={Typography} variant="h3">
              Skipped
            </Grid>
            <Grid item xs md={8} lg={6}>
              <Card>
                <Typography component={CardContent} variant="body2">
                  {report.skippedReason.value}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 2, mb: 4, mx: 0 }}
            >
              {!report ? (
                <Skeleton width="20ch" />
              ) : report.receivedDate.value ? (
                <>
                  Received on <FormattedDate date={report.receivedDate.value} />
                </>
              ) : !report.receivedDate.canRead ? (
                <Redacted info="You don't have permission to view the received date" />
              ) : (
                'Not received yet'
              )}
            </Typography>

            <Stack spacing={3} flex={1}>
              <Grid container spacing={3} maxWidth="md">
                <Grid item xs={12} md={7} container>
                  <ProgressSummaryCard
                    loading={!report}
                    summary={report?.cumulativeSummary ?? null}
                  />
                </Grid>
                <Grid item xs={12} md={5} container>
                  {report ? (
                    newProgressReportBeta ? (
                      <NewProgressReportCard label="Progress Report" />
                    ) : (
                      <ProgressReportCard
                        progressReport={report}
                        disableIcon
                        onUpload={({ files }) => setUploading(files)}
                      />
                    )
                  ) : (
                    <FieldOverviewCard />
                  )}
                </Grid>
              </Grid>
              <ProductTableList products={report?.progress} />
            </Stack>
          </>
        )}
      </Box>
      {newProgressReportBeta && <ProgressReportDrawer report={report} />}
    </Box>
  );
};
