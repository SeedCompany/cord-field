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
import { Breadcrumb } from '../../../components/Breadcrumb';
import {
  idForUrl,
  useChangesetAwareIdFromUrl,
} from '../../../components/Changeset';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { Error } from '../../../components/Error';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ButtonLink, FabLink, Navigate } from '../../../components/Routing';
import { SkipReportButton } from '../../Projects/Reports/SkipReportButton';
import { ProgressReportDrawer } from '../EditForm';
import {
  ProgressReportDetailDocument,
  ProgressReportDetailFragment,
} from './ProgressReportDetail.graphql';
import { ProgressSummaryCard } from './ProgressSummaryCard';
import { PromptResponseCard } from './PromptResponseCard';
import { StatusStepper } from './StatusStepper';

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
}));

export const ProgressReportDetail = () => {
  const { classes } = useStyles();
  const { id, changesetId } = useChangesetAwareIdFromUrl('reportId');

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
              <Tooltip title="Edit Report">
                <FabLink to="edit" color="primary" loading={!report}>
                  <Edit />
                </FabLink>
              </Tooltip>
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
          <Stack spacing={3} maxWidth="lg" alignItems="flex-start" mt={1}>
            <StatusStepper
              current={report?.status.value}
              sx={{ width: 1, maxWidth: 'sm' }}
            />

            <ProgressSummaryCard
              loading={!report}
              summary={report?.cumulativeSummary ?? null}
              varianceExplanation={report?.varianceExplanation}
              actions={
                <ButtonLink to="edit?step=progress">View Details</ButtonLink>
              }
              sx={{ width: 1, maxWidth: 'sm' }}
            />

            <Stack
              spacing={3}
              direction={{ md: 'column', lg: 'row' }}
              sx={{
                width: 1,
                alignItems: { lg: 'flex-start' },
                '& > *': {
                  flex: { lg: 1 },
                  maxWidth: 'sm',
                },
              }}
            >
              <PromptResponseCard
                title="Team News"
                promptResponse={report?.teamNews.items[0]}
                loading={!report}
                placeholder="None yet"
                actions={
                  <ButtonLink to="edit?step=team-news">View Details</ButtonLink>
                }
              />

              <PromptResponseCard
                title="Community Story"
                showPrompt
                promptResponse={report?.communityStories.items[0]}
                loading={!report}
                placeholder="No response yet"
                actions={
                  <ButtonLink to="edit?step=community-story">
                    View Details
                  </ButtonLink>
                }
              />
            </Stack>
          </Stack>
        )}
      </main>
      <ProgressReportDrawer reportId={id} />
    </div>
  );
};
