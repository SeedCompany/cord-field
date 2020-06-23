import {
  Button,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add, Publish } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { FC, ReactNode } from 'react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { displayStatus } from '../../../api';
import { BudgetOverviewCard } from '../../../components/BudgetOverviewCard';
import { CardGroup } from '../../../components/CardGroup';
import { Fab } from '../../../components/Fab';
import { FilesOverviewCard } from '../../../components/FilesOverviewCard';
import { useDateFormatter } from '../../../components/Formatters';
import { InternshipEngagementListItemCard } from '../../../components/InternshipEngagementListItemCard';
import { LanguageEngagementListItemCard } from '../../../components/LanguageEngagementListItemCard';
import { PartnershipSummary } from '../../../components/PartnershipSummary';
import { ProjectMembersSummary } from '../../../components/ProjectMembersSummary';
import { useProjectOverviewQuery } from './ProjectOverview.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
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
}));

export const ProjectOverview: FC = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  const formatDate = useDateFormatter();

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

  const renderButtonData = (children: ReactNode) =>
    !data ? (
      <Grid item>
        <Skeleton>
          <Button variant="outlined">&nbsp;</Button>
        </Skeleton>
      </Grid>
    ) : children ? (
      <Grid item>
        <Button variant="outlined">{children}</Button>
      </Grid>
    ) : null;

  const dateRange =
    data?.project.mouStart.value && data?.project.mouEnd.value
      ? formatDate(data?.project.mouStart.value) +
        ' - ' +
        formatDate(data?.project.mouEnd.value)
      : 'Start - End';

  return (
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error fetching project</Typography>
      ) : (
        <div className={classes.main}>
          <Typography variant="h2">
            {data ? data?.project.name?.value : <Skeleton width="50%" />}
          </Typography>

          <Typography variant="h4">
            {data ? 'Project Overview' : <Skeleton width="25%" />}
          </Typography>

          <Grid container spacing={1} alignItems="center">
            {renderButtonData(
              data?.project.location.value?.name ?? 'Enter Location'
            )}
            {renderButtonData(dateRange)}
            {renderButtonData(displayStatus(data?.project.status))}
          </Grid>

          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Fab color="primary" aria-label="Upload Files">
                <Publish />
              </Fab>
            </Grid>
            <Grid item>
              <Typography variant="h4">Upload Files</Typography>
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
                  `${data.project.engagements.total} ${engagementTypeLabel} Engagements`
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
