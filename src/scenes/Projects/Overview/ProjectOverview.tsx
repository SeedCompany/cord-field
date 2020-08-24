import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add, DateRange, Publish } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';
import { displayStatus, securedDateRange } from '../../../api';
import { displayLocation } from '../../../api/location-helper';
import { BudgetOverviewCard } from '../../../components/BudgetOverviewCard';
import { CardGroup } from '../../../components/CardGroup';
import { DataButton } from '../../../components/DataButton';
import { useDialog } from '../../../components/Dialog';
import { DisplaySimpleProperty } from '../../../components/DisplaySimpleProperty';
import { Fab } from '../../../components/Fab';
import { FilesOverviewCard } from '../../../components/files/FilesOverviewCard';
import {
  useDateFormatter,
  useDateTimeFormatter,
  useNumberFormatter,
} from '../../../components/Formatters';
import { InternshipEngagementListItemCard } from '../../../components/InternshipEngagementListItemCard';
import { LanguageEngagementListItemCard } from '../../../components/LanguageEngagementListItemCard';
import { PartnershipSummary } from '../../../components/PartnershipSummary';
import { ProjectMembersSummary } from '../../../components/ProjectMembersSummary';
import { Redacted } from '../../../components/Redacted';
import { CreateInternshipEngagement } from '../../Engagement/InternshipEngagement/Create/CreateInternshipEngagement';
import { CreateLanguageEngagement } from '../../Engagement/LanguageEngagement/Create/CreateLanguageEngagement';
import { useProjectCurrentDirectory, useUploadProjectFiles } from '../Files';
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
  const formatNumber = useNumberFormatter();

  const { directoryId } = useProjectCurrentDirectory();
  const handleFilesDrop = useUploadProjectFiles(directoryId);

  const { getRootProps, getInputProps, open: openFileBrowser } = useDropzone({
    onDrop: handleFilesDrop,
    noClick: true,
  });

  const [createEngagementState, createEngagement] = useDialog();

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

  const populationTotal =
    data?.project.engagements.items.reduce(
      (total, item) =>
        item.__typename === 'LanguageEngagement'
          ? total + (item.language.value?.population.value ?? 0)
          : total,
      0
    ) || undefined;

  const date = data
    ? securedDateRange(data.project.mouStart, data.project.mouEnd)
    : undefined;

  const CreateEngagement =
    data?.project.__typename === 'TranslationProject'
      ? CreateLanguageEngagement
      : CreateInternshipEngagement;

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

          <Grid container spacing={1}>
            <Grid item>
              <DisplaySimpleProperty
                loading={!data}
                label="Project ID"
                value={data?.project.id}
                loadingWidth={100}
                LabelProps={{ color: 'textSecondary' }}
                ValueProps={{ color: 'textPrimary' }}
              />
            </Grid>
            <Grid item>
              <DisplaySimpleProperty
                loading={!data}
                label="Department ID"
                value={data?.project.deptId.value}
                loadingWidth={100}
                LabelProps={{ color: 'textSecondary' }}
                ValueProps={{ color: 'textPrimary' }}
              />
            </Grid>
          </Grid>
          <DisplaySimpleProperty
            loading={!data}
            label="Population Total"
            value={formatNumber(populationTotal)}
            loadingWidth={100}
            LabelProps={{ color: 'textSecondary' }}
            ValueProps={{ color: 'textPrimary' }}
            wrap={(node) => (
              <Grid item>
                <Tooltip
                  title={
                    data ? 'Total population of all languages engaged' : ''
                  }
                >
                  {node}
                </Tooltip>
              </Grid>
            )}
          />

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
              <span {...getRootProps()}>
                <input {...getInputProps()} />
                <Fab
                  loading={!data}
                  onClick={openFileBrowser}
                  color="primary"
                  aria-label="Upload Files"
                >
                  <Publish />
                </Fab>
              </span>
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
              budget={data?.project.budget.value}
            />
            {/* TODO When file api is finished need to update query and pass in file information */}
            <FilesOverviewCard loading={!data} total={undefined} />
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
                    onClick={createEngagement}
                  >
                    <Add />
                    <CreateEngagement
                      projectId={projectId}
                      {...createEngagementState}
                    />
                  </Fab>
                </Tooltip>
              )}
            </Grid>
          </Grid>
          {data?.project.engagements.items.map((engagement) =>
            engagement.__typename === 'LanguageEngagement' ? (
              <LanguageEngagementListItemCard
                key={engagement.id}
                projectId={projectId}
                {...engagement}
              />
            ) : (
              <InternshipEngagementListItemCard
                key={engagement.id}
                projectId={projectId}
                {...engagement}
              />
            )
          )}
        </div>
      )}
    </main>
  );
};
