import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add, DateRange, Publish } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { FC } from 'react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { displayStatus, securedDateRange } from '../../../api';
import { displayLocation } from '../../../api/location-helper';
import { BudgetOverviewCard } from '../../../components/BudgetOverviewCard';
import { CardGroup } from '../../../components/CardGroup';
import { DataButton } from '../../../components/DataButton';
import { Fab } from '../../../components/Fab';
import { FilesOverviewCard } from '../../../components/files/FilesOverviewCard';
import {
  useDateFormatter,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { InternshipEngagementListItemCard } from '../../../components/InternshipEngagementListItemCard';
import { LanguageEngagementListItemCard } from '../../../components/LanguageEngagementListItemCard';
import { PartnershipSummary } from '../../../components/PartnershipSummary';
import { ProjectMembersSummary } from '../../../components/ProjectMembersSummary';
import { Redacted } from '../../../components/Redacted';
import { useProjectOverviewQuery } from './ProjectOverview.generated';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
    '& > *': {
      marginBottom: spacing(3),
    },
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  budgetOverviewCard: {
    marginRight: spacing(3),
  },
  infoColor: {
    color: palette.info.main,
  },
  subheader: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginRight: spacing(2),
    },
  },
}));

export const ProjectOverview: FC = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  const formatDate = useDateFormatter();
  const formatDateTime = useDateTimeFormatter();

  const { data, error } = useProjectOverviewQuery({
    variables: {
      input: projectId,
    },
  });

  const engagementTypeLabel = data?.project.__typename
    ? data.project.__typename === 'TranslationProject'
      ? 'Language'
      : 'Intern'
    : null;

  const date = data
    ? securedDateRange(data.project.mouStart, data.project.mouEnd)
    : undefined;

  return (
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error loading project</Typography>
      ) : (
        <div className={classes.main}>
          <Typography variant="h2">
            {data ? (
              data.project.name.canRead ? (
                data.project.name.value
              ) : (
                <Redacted
                  info="You do not have permission to view project's name"
                  width="50%"
                />
              )
            ) : (
              <Skeleton width="50%" />
            )}
          </Typography>

          <div className={classes.subheader}>
            <Typography variant="h4">
              {data ? 'Project Overview' : <Skeleton width={200} />}
            </Typography>

            {data && (
              <Typography variant="body2" color="textSecondary">
                Updated {formatDateTime(data.project.modifiedAt)}
              </Typography>
            )}
          </div>

          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <DataButton
                loading={!data}
                secured={data?.project.location}
                empty="Enter Location"
                redacted="You do not have permission to view location"
                children={displayLocation}
              />
            </Grid>
            <Grid item>
              <DataButton
                loading={!data}
                startIcon={<DateRange className={classes.infoColor} />}
                secured={date}
                redacted="You do not have permission to view start/end dates"
                children={formatDate.range}
                empty="Start - End"
              />
            </Grid>
            <Grid item>
              <DataButton loading={!data}>
                {displayStatus(data?.project.status)}
              </DataButton>
            </Grid>
          </Grid>

          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Fab loading={!data} color="primary" aria-label="Upload Files">
                <Publish />
              </Fab>
            </Grid>
            <Grid item>
              <Typography variant="h4">
                {data ? 'Upload Files' : <Skeleton width="12ch" />}
              </Typography>
            </Grid>
          </Grid>

          <div className={classes.container}>
            <BudgetOverviewCard
              className={classes.budgetOverviewCard}
              budget={data?.project.budget?.value}
            />
            {/* TODO When file api is finished need to update query and pass in file information */}
            <FilesOverviewCard loading={!data} />
          </div>
          <CardGroup>
            <ProjectMembersSummary members={data?.project.team} />
            <PartnershipSummary partnerships={data?.project.partnerships} />
          </CardGroup>

          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="h3">
                {data ? (
                  !data.project.engagements.canRead ? (
                    <Redacted
                      info="You do not have permission to view engagements"
                      width="50%"
                    />
                  ) : (
                    `${data.project.engagements.total} ${engagementTypeLabel} Engagements`
                  )
                ) : (
                  <Skeleton width="40%" />
                )}
              </Typography>
            </Grid>
            <Grid item>
              {data?.project.engagements.canCreate && (
                <Tooltip title={`Add ${engagementTypeLabel} Engagement`}>
                  <Fab
                    color="error"
                    aria-label={`Add ${engagementTypeLabel} Engagement`}
                  >
                    <Add />
                  </Fab>
                </Tooltip>
              )}
            </Grid>
          </Grid>
          {data?.project?.engagements?.items?.map((engagement) =>
            engagement.__typename === 'LanguageEngagement' ? (
              <LanguageEngagementListItemCard {...engagement} />
            ) : engagement.__typename === 'InternshipEngagement' ? (
              <InternshipEngagementListItemCard {...engagement} />
            ) : null
          )}
        </div>
      )}
    </main>
  );
};
