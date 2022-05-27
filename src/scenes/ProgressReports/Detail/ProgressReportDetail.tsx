import { useQuery } from '@apollo/client';
import {
  Breadcrumbs,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Edit, SkipNextRounded as SkipIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useWindowSize } from 'react-use';
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
import { PlanningNotAllowedCard } from './PlanningNotAllowedCard';
import { ProductTableList } from './ProductTableList';
import { ProgressReportCard } from './ProgressReportCard';
import { ProgressReportDetailDocument } from './ProgressReportDetail.graphql';
import { ProgressSummaryCard } from './ProgressSummaryCard';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
  },
  main: {
    padding: spacing(4),
    maxWidth: breakpoints.values.md,
  },
  header: {
    marginTop: spacing(3),
    marginBottom: spacing(2),
  },
  subheader: {
    margin: spacing(2, 0, 4),
  },
}));

export const ProgressReportDetail: FC = () => {
  const classes = useStyles();
  const { id, changesetId } = useChangesetAwareIdFromUrl('reportId');
  const windowSize = useWindowSize();

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
  const totalProducts = engagement?.products.total ?? 0;

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Helmet title="Progress Report" />
        <Breadcrumbs
          children={[
            <ProjectBreadcrumb data={engagement?.project} />,
            <EngagementBreadcrumb data={engagement} />,
            <Breadcrumb
              to={
                engagement
                  ? `/engagements/${idForUrl(engagement)}/reports/progress`
                  : undefined
              }
            >
              {!report ? <Skeleton width={200} /> : 'Progress Reports'}
            </Breadcrumb>,
            <Breadcrumb to=".">
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
          <Grid container direction="column" spacing={2}>
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

            <Grid container direction="column" spacing={3}>
              <Grid item container spacing={3}>
                <Grid item xs={12} md={7} container>
                  <ProgressSummaryCard
                    loading={!report}
                    summary={report?.cumulativeSummary ?? null}
                  />
                </Grid>
                <Grid item xs={12} md={5} container>
                  {totalProducts === 0 ? (
                    <PlanningNotAllowedCard />
                  ) : report ? (
                    <ProgressReportCard
                      progressReport={report}
                      disableIcon
                      onUpload={({ files }) => setUploading(files)}
                    />
                  ) : (
                    <FieldOverviewCard />
                  )}
                </Grid>
              </Grid>
              <ProductTableList
                products={report?.progress}
                style={{
                  maxWidth:
                    windowSize.width !== Infinity
                      ? // window - sidebar - margin
                        windowSize.width - 248 - 8 * 2
                      : undefined,
                }}
              />
            </Grid>
          </>
        )}
      </main>
    </div>
  );
};
