import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import {
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
import { makeStyles } from 'tss-react/mui';
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
import { FormattedDate } from '../../../components/Formatters';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { ButtonLink, Navigate } from '../../../components/Routing';
import { SkipReportButton } from '../../Projects/Reports/SkipReportButton';
import { UpdatePeriodicReportDialog } from '../../Projects/Reports/UpdatePeriodicReportDialog';
import { ProgressReportDrawer } from '../EditForm';
import {
  ProgressReportDetailDocument,
  ProgressReportDetailFragment,
} from './ProgressReportDetail.graphql';
import { ProgressSummaryCard } from './ProgressSummaryCard';
import { PromptResponseCard } from './PromptResponseCard';

const useStyles = makeStyles()(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginTop: spacing(3),
    marginBottom: spacing(2),
  },
  subheader: {
    margin: spacing(2, 0, 4),
  },
}));

export const ProgressReportDetail = () => {
  const { classes } = useStyles();
  const { id, changesetId } = useChangesetAwareIdFromUrl('reportId');

  const beta = useBetaFeatures();
  const newProgressReportBeta = beta.has('newProgressReports');

  // Single file for new version, empty array for received date update.
  const [dialogState, setUploading, upload] = useDialog<File[]>();

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

  const report = data?.periodicReport as
    | ProgressReportDetailFragment
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- safety check. It's possible with manual user input.
  if (report && report.__typename !== 'ProgressReport') {
    return <Navigate to="/" />;
  }

  const engagement = report?.parent;

  return (
    <div className={classes.root}>
      <main className={classes.main}>
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

        <Grid
          container
          spacing={3}
          alignItems="center"
          className={classes.header}
        >
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
          <Grid item>
            <SkipReportButton report={report} />
          </Grid>
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
              className={classes.subheader}
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

            <PromptResponseCard
              title="Team News"
              promptResponse={report?.teamNews.items[0]}
              sx={{ maxWidth: 'sm', mb: 4 }}
            />

            <PromptResponseCard
              title="Community Story"
              showPrompt
              promptResponse={report?.communityStories.items[0]}
              sx={{ maxWidth: 'sm', mb: 4 }}
            />

            <Stack spacing={3} flex={1}>
              <Grid container spacing={3} maxWidth="md">
                <Grid item xs={12} md={7} container>
                  <ProgressSummaryCard
                    loading={!report}
                    summary={report?.cumulativeSummary ?? null}
                    varianceExplanation={report?.varianceExplanation}
                    sx={{ width: 1 }}
                    actions={
                      <ButtonLink to="edit?step=progress">
                        View Details
                      </ButtonLink>
                    }
                  />
                </Grid>
              </Grid>
            </Stack>
          </>
        )}
      </main>
      {newProgressReportBeta && report && (
        <ProgressReportDrawer reportId={report.id} />
      )}
    </div>
  );
};
