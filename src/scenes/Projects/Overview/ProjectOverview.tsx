import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add, DateRange, Edit, Publish } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';
import { displayProjectStep, securedDateRange } from '../../../api';
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
import { Many } from '../../../util';
import { CreateInternshipEngagement } from '../../Engagement/InternshipEngagement/Create/CreateInternshipEngagement';
import { CreateLanguageEngagement } from '../../Engagement/LanguageEngagement/Create/CreateLanguageEngagement';
import { useProjectCurrentDirectory, useUploadProjectFiles } from '../Files';
import { EditableProjectField, UpdateProjectDialog } from '../Update';
import {
  useProjectEngagementListOverviewQuery,
  useProjectOverviewQuery,
} from './ProjectOverview.generated';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
    '& > *': {
      marginBottom: spacing(3),
    },
  },
  header: {
    flex: 1,
    display: 'flex',
  },
  name: {
    marginRight: spacing(4),
  },
  nameLoading: {
    width: '60%',
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

  const [editState, editField, fieldsBeingEdited] = useDialog<
    Many<EditableProjectField>
  >();

  const {
    directoryId,
    loading: directoryIdLoading,
    canRead: canReadDirectoryId,
  } = useProjectCurrentDirectory();
  const uploadProjectFiles = useUploadProjectFiles();

  const handleDrop = (files: File[]) => {
    uploadProjectFiles({ files, parentId: directoryId });
  };

  const { getRootProps, getInputProps, open: openFileBrowser } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
    disabled: !directoryId,
  });

  const [createEngagementState, createEngagement] = useDialog();

  const { data: projectOverviewData, error } = useProjectOverviewQuery({
    variables: {
      input: projectId,
    },
  });

  const { data: engagementListData } = useProjectEngagementListOverviewQuery({
    variables: {
      input: projectId,
    },
  });

  const projectName = projectOverviewData?.project.name;

  const engagementTypeLabel = projectOverviewData?.project.__typename
    ? projectOverviewData.project.__typename === 'TranslationProject'
      ? 'Language'
      : 'Intern'
    : null;

  const populationTotal = engagementListData?.project.engagements.items.reduce(
    (total, item) =>
      item.__typename === 'LanguageEngagement'
        ? total + (item.language.value?.population.value ?? 0)
        : total,
    0
  );

  const date = projectOverviewData
    ? securedDateRange(
        projectOverviewData.project.mouStart,
        projectOverviewData.project.mouEnd
      )
    : undefined;

  const CreateEngagement =
    projectOverviewData?.project.__typename === 'TranslationProject'
      ? CreateLanguageEngagement
      : CreateInternshipEngagement;

  return (
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error loading project</Typography>
      ) : (
        <div className={classes.main}>
          <header className={classes.header}>
            <Typography
              variant="h2"
              className={clsx(
                classes.name,
                projectName ? null : classes.nameLoading
              )}
            >
              {!projectName ? (
                <Skeleton width="100%" />
              ) : projectName.canRead ? (
                projectName.value
              ) : (
                <Redacted
                  info="You do not have permission to view project's name"
                  width="50%"
                />
              )}
            </Typography>
            {projectOverviewData?.project.name.canEdit && (
              <Fab
                color="primary"
                aria-label="edit project name"
                onClick={() => editField(['name'])}
              >
                <Edit />
              </Fab>
            )}
          </header>

          <div className={classes.subheader}>
            <Typography variant="h4">
              {projectOverviewData ? (
                'Project Overview'
              ) : (
                <Skeleton width={200} />
              )}
            </Typography>
            {projectOverviewData && (
              <Typography variant="body2" color="textSecondary">
                Updated {formatDateTime(projectOverviewData.project.modifiedAt)}
              </Typography>
            )}
          </div>

          <Grid container spacing={1}>
            <Grid item>
              <DisplaySimpleProperty
                loading={!projectOverviewData}
                label="Project ID"
                value={projectOverviewData?.project.id}
                loadingWidth={100}
                LabelProps={{ color: 'textSecondary' }}
                ValueProps={{ color: 'textPrimary' }}
              />
            </Grid>
            <Grid item>
              <DisplaySimpleProperty
                loading={!projectOverviewData}
                label="Department ID"
                value={projectOverviewData?.project.departmentId.value}
                loadingWidth={100}
                LabelProps={{ color: 'textSecondary' }}
                ValueProps={{ color: 'textPrimary' }}
              />
            </Grid>
          </Grid>
          {projectOverviewData?.project.__typename === 'TranslationProject' && (
            <Tooltip title={'Total population of all languages engaged'}>
              <Grid item xs={3}>
                <DisplaySimpleProperty
                  loading={!engagementListData}
                  label="Population Total"
                  value={formatNumber(populationTotal)} // formats to string
                  loadingWidth={100}
                  LabelProps={{ color: 'textSecondary' }}
                  ValueProps={{ color: 'textPrimary' }}
                />
              </Grid>
            </Tooltip>
          )}
          {projectOverviewData?.project.__typename === 'InternshipProject' && (
            <Grid item>
              <DisplaySimpleProperty
                loading={!engagementListData}
                label="Total Interns"
                value={formatNumber(
                  engagementListData?.project.engagements.total
                )} // formats to string
                loadingWidth={100}
                LabelProps={{ color: 'textSecondary' }}
                ValueProps={{ color: 'textPrimary' }}
              />
            </Grid>
          )}
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <DataButton
                loading={!projectOverviewData}
                secured={projectOverviewData?.project.primaryLocation}
                empty="Enter Location"
                redacted="You do not have permission to view location"
                children={
                  projectOverviewData?.project.primaryLocation.value?.name.value
                }
              />
            </Grid>
            <Grid item>
              <DataButton
                loading={!projectOverviewData}
                startIcon={<DateRange className={classes.infoColor} />}
                secured={date}
                redacted="You do not have permission to view start/end dates"
                children={formatDate.range}
                empty="Start - End"
                onClick={() => editField(['mouStart', 'mouEnd'])}
              />
            </Grid>
            {projectOverviewData?.project.status === 'InDevelopment' && (
              <Tooltip title="Estimated Submission to Regional Director">
                <Grid item>
                  <DataButton
                    loading={!projectOverviewData}
                    startIcon={<DateRange className={classes.infoColor} />}
                    secured={projectOverviewData.project.estimatedSubmission}
                    redacted="You do not have permission to view estimated submission date"
                    children={formatDate}
                    empty="Estimated Submission"
                    onClick={() => editField(['estimatedSubmission'])}
                  />
                </Grid>
              </Tooltip>
            )}
            <Grid item>
              <DataButton
                loading={!projectOverviewData}
                secured={projectOverviewData?.project.step}
                redacted="You do not have permission to view project step"
                onClick={() => editField('step')}
              >
                {displayProjectStep(projectOverviewData?.project.step.value)}
              </DataButton>
            </Grid>
          </Grid>

          {directoryIdLoading || !canReadDirectoryId ? null : (
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <span {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Fab
                    loading={!projectOverviewData}
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
                  {projectOverviewData ? (
                    'Upload Files'
                  ) : (
                    <Skeleton width="12ch" />
                  )}
                </Typography>
              </Grid>
            </Grid>
          )}
          <div className={classes.container}>
            <BudgetOverviewCard
              budget={projectOverviewData?.project.budget.value}
              className={classes.budgetOverviewCard}
              loading={!projectOverviewData}
            />
            {/* TODO When file api is finished need to update query and pass in file information */}
            <FilesOverviewCard
              loading={!projectOverviewData}
              total={undefined}
              redacted={canReadDirectoryId === true}
            />
          </div>
          <CardGroup>
            <ProjectMembersSummary
              members={projectOverviewData?.project.team}
            />
            <PartnershipSummary
              partnerships={projectOverviewData?.project.partnerships}
            />
          </CardGroup>

          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="h3">
                {projectOverviewData && engagementListData ? (
                  !engagementListData.project.engagements.canRead ? (
                    <Redacted
                      info="You do not have permission to view engagements"
                      width={400}
                    />
                  ) : (
                    `${engagementListData.project.engagements.total} ${engagementTypeLabel} Engagements`
                  )
                ) : (
                  <Skeleton width={400} />
                )}
              </Typography>
            </Grid>
            <Grid item>
              {engagementListData?.project.engagements.canCreate && (
                <Tooltip title={`Add ${engagementTypeLabel} Engagement`}>
                  <Fab
                    color="error"
                    aria-label={`Add ${engagementTypeLabel} Engagement`}
                    onClick={createEngagement}
                  >
                    <Add />
                  </Fab>
                </Tooltip>
              )}
            </Grid>
          </Grid>
          {engagementListData?.project.engagements.items.map((engagement) =>
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
      {projectOverviewData ? (
        <UpdateProjectDialog
          {...editState}
          project={projectOverviewData.project}
          editFields={fieldsBeingEdited}
        />
      ) : null}
      <CreateEngagement projectId={projectId} {...createEngagementState} />
    </main>
  );
};
