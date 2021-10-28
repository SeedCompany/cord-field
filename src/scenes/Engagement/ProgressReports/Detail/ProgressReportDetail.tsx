import { useQuery } from '@apollo/client';
import { Breadcrumbs, Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { groupBy } from 'lodash';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { Error } from '../../../../components/Error';
import { FieldOverviewCard } from '../../../../components/FieldOverviewCard';
import { FormattedDateTime } from '../../../../components/Formatters';
import { ReportLabel } from '../../../../components/PeriodicReports/ReportLabel';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../../components/Redacted';
import { useProjectId } from '../../../Projects/useProjectId';
import { useLanguageEngagementName } from '../../LanguageEngagement';
import { CumulativeSummaryCard } from './CumulativeSummaryCard';
import { ProductTableList } from './ProductTableList';
import { ProgressReportCard } from './ProgressReportCard';
import { ProgressReportDetailDocument } from './ProgressReportDetail.generated';

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
    margin: spacing(3, 0, 2),
  },
  subheader: {
    margin: spacing(2, 0),
  },
}));

export const ProgressReportDetail: FC = () => {
  const classes = useStyles();
  const { projectId, changesetId, projectUrl } = useProjectId();
  const { engagementId = '', progressReportId = '' } = useParams();

  const { data, error } = useQuery(ProgressReportDetailDocument, {
    variables: {
      projectId,
      changeset: changesetId,
      engagementId,
      progressReportId,
    },
  });

  const languageName = useLanguageEngagementName(data?.engagement);

  if (error) {
    return (
      <Error page error={error}>
        {{
          NotFound: 'Could not find project, engagement or progress report',
          Default: 'Error loading progress report',
        }}
      </Error>
    );
  }

  const progressReport =
    data?.periodicReport.__typename === 'ProgressReport'
      ? data.periodicReport
      : null;

  const products =
    data?.engagement.__typename === 'LanguageEngagement'
      ? data.engagement.products
      : null;

  const groupedProducts = groupBy(
    products?.items,
    (product) => product.category
  );

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <div>
          <Helmet title={`Progress Report`} />
          <Breadcrumbs
            children={[
              <ProjectBreadcrumb data={data?.project} />,
              <Breadcrumb
                to={
                  data ? `${projectUrl}/engagements/${data.engagement.id}` : '.'
                }
              >
                {!data ? (
                  <Skeleton width={200} />
                ) : languageName ? (
                  languageName
                ) : (
                  <Redacted
                    info="You do not have permission to view this engagement's name"
                    width={200}
                  />
                )}
              </Breadcrumb>,
              <Breadcrumb to=".">
                {!progressReport ? (
                  <Skeleton width={200} />
                ) : (
                  <ReportLabel report={progressReport} />
                )}
              </Breadcrumb>,
            ]}
          />

          <Typography variant="h2" className={classes.header}>
            {data ? (
              <>
                Progress Report - <ReportLabel report={progressReport} />
              </>
            ) : (
              <Skeleton width={200} />
            )}
          </Typography>

          <div className={classes.subheader}>
            {progressReport ? (
              <Typography variant="body2" color="textSecondary">
                Submitted{' '}
                <FormattedDateTime
                  date={progressReport.reportFile.value?.modifiedAt}
                />
              </Typography>
            ) : (
              <Skeleton width={200} />
            )}
          </div>
        </div>

        <Grid container direction="column" spacing={3}>
          <Grid item container spacing={3}>
            <Grid item xs={12} md={8} container>
              <CumulativeSummaryCard
                loading={!progressReport}
                summary={progressReport?.cumulativeSummary ?? null}
              />
            </Grid>
            <Grid item xs={12} md={4} container>
              {progressReport ? (
                <ProgressReportCard progressReport={progressReport} />
              ) : (
                <FieldOverviewCard />
              )}
            </Grid>
          </Grid>
          <Grid item container direction="column" spacing={3}>
            <Grid item component={Typography} variant={'h3'}>
              Products
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <ProductTableList
                products={groupedProducts}
                methodologyAvailableSteps={
                  data?.methodologyAvailableSteps ?? []
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};
