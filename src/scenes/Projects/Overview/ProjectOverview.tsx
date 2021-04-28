import { useQuery } from '@apollo/client';
import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add, DateRange, Edit, Publish } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { displayProjectStep, securedDateRange } from '../../../api';
import { BudgetOverviewCard } from '../../../components/BudgetOverviewCard';
import { CardGroup } from '../../../components/CardGroup';
import { DataButton } from '../../../components/DataButton';
import { useDialog } from '../../../components/Dialog';
import { DisplaySimpleProperty } from '../../../components/DisplaySimpleProperty';
import { Error } from '../../../components/Error';
import { Fab } from '../../../components/Fab';
import { FilesOverviewCard } from '../../../components/files/FilesOverviewCard';
import {
  FormattedDate,
  FormattedDateRange,
  FormattedDateTime,
  useNumberFormatter,
} from '../../../components/Formatters';
import { IconButton } from '../../../components/IconButton';
import { InternshipEngagementListItemCard } from '../../../components/InternshipEngagementListItemCard';
import { LanguageEngagementListItemCard } from '../../../components/LanguageEngagementListItemCard';
import { List, useListQuery } from '../../../components/List';
import { PartnershipSummary } from '../../../components/PartnershipSummary';
import { ProjectMembersSummary } from '../../../components/ProjectMembersSummary';
import { Redacted } from '../../../components/Redacted';
import { SensitivityIcon } from '../../../components/Sensitivity';
import { TogglePinButton } from '../../../components/TogglePinButton';
import { Many } from '../../../util';
import { CreateInternshipEngagement } from '../../Engagement/InternshipEngagement/Create/CreateInternshipEngagement';
import { CreateLanguageEngagement } from '../../Engagement/LanguageEngagement/Create/CreateLanguageEngagement';
import { useProjectCurrentDirectory, useUploadProjectFiles } from '../Files';
import { ProjectListQueryVariables } from '../List/projects.generated';
import { EditableProjectField, UpdateProjectDialog } from '../Update';
import { ProjectWorkflowDialog } from '../Update/ProjectWorkflowDialog';
import {
  ProjectEngagementListOverviewDocument as EngagementList,
  ProjectOverviewDocument,
  ProjectOverviewFragment,
} from './ProjectOverview.generated';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
    '& > *:not(:last-child)': {
      marginBottom: spacing(3),
    },
  },
  header: {
    flex: 1,
    display: 'flex',
  },
  headerLoading: {
    alignItems: 'center',
  },
  name: {
    marginRight: spacing(2),
  },
  nameLoading: {
    width: '30%',
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
  pushPinIcon: {
    marginLeft: spacing(1),
  },
  engagementList: {
    // fix spacing above applied with > *
    marginTop: spacing(-3),
  },
  engagementListItems: {
    maxWidth: 600,
  },
}));

export const ProjectOverview: FC = () => {
  const classes = useStyles();
  const { projectId = '' } = useParams();
  const formatNumber = useNumberFormatter();

  const [editState, editField, fieldsBeingEdited] = useDialog<
    Many<EditableProjectField>
  >();
  const [
    workflowState,
    openWorkflow,
    workflowProject,
  ] = useDialog<ProjectOverviewFragment>();

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

  const { data: projectOverviewData, error } = useQuery(
    ProjectOverviewDocument,
    {
      variables: {
        input: projectId,
      },
    }
  );

  const engagements = useListQuery(EngagementList, {
    listAt: (data) => data.project.engagements,
    variables: {
      project: projectId,
    },
  });

  const projectName = projectOverviewData?.project.name;
  const isTranslation = projectOverviewData
    ? projectOverviewData.project.__typename === 'TranslationProject'
    : undefined;

  const engagementTypeLabel =
    isTranslation != null ? (isTranslation ? 'Language' : 'Intern') : null;

  const populationTotal = engagements.data?.items.reduce(
    (total, item) =>
      item.__typename === 'LanguageEngagement'
        ? // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          total + (item.language.value?.population.value ?? 0)
        : total,
    0
  );

  const primaryLocation = projectOverviewData?.project.primaryLocation;
  const region = projectOverviewData?.project.fieldRegion;
  const locations = {
    canRead: (primaryLocation?.canRead || region?.canRead) ?? false,
    canEdit: (primaryLocation?.canEdit || region?.canEdit) ?? false,
    value:
      /**
       * A lot going on here. Obviously if both values exist, we'll show
       * them. If neither value exists, we want to pass the `DataButton`
       * `undefined`, and then we just use the `empty` prop of the
       * `DataButton` to display whatever message deem appropriate.
       *
       * But if only one value exists, we still want to display "Enter XX"
       * in the place where the other value **would** be—BUT ONLY if the
       * user has edit rights, otherwise they'll just be annoyed that we
       * prompted them to "Enter XX" when really they're not allowed.
       */
      !primaryLocation?.value && !region?.value
        ? undefined
        : `${
            primaryLocation?.value?.name.value ??
            (primaryLocation?.canEdit ? 'Enter Location' : '')
          }${
            (primaryLocation?.value && region?.value) ||
            (primaryLocation?.canEdit && region?.value) ||
            (primaryLocation?.value && region?.canEdit) ||
            (primaryLocation?.canEdit && region?.canEdit)
              ? ' | '
              : ''
          }${
            region?.value?.name.value ?? (region?.canEdit ? 'Enter Region' : '')
          }`,
  };

  const date = projectOverviewData
    ? securedDateRange(
        projectOverviewData.project.mouStart,
        projectOverviewData.project.mouEnd
      )
    : undefined;

  const CreateEngagement = isTranslation
    ? CreateLanguageEngagement
    : CreateInternshipEngagement;

  return (
    <main className={classes.root}>
      <Helmet title={projectOverviewData?.project.name.value ?? undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find project',
          Default: 'Error loading project',
        }}
      </Error>
      {!error && (
        <div className={classes.main}>
          <header
            className={clsx(
              classes.header,
              projectOverviewData ? null : classes.headerLoading
            )}
          >
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
            {(!projectOverviewData ||
              projectOverviewData.project.name.canEdit) && (
              <Tooltip title="Edit Project Name">
                <IconButton
                  aria-label="edit project name"
                  onClick={() => editField(['name'])}
                  loading={!projectOverviewData}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            <TogglePinButton
              object={projectOverviewData?.project}
              label="Project"
              listId="projects"
              listFilter={(args: ProjectListQueryVariables) =>
                args.input.filter?.pinned ?? false
              }
              className={classes.pushPinIcon}
            />
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
                Updated{' '}
                <FormattedDateTime
                  date={projectOverviewData.project.modifiedAt}
                />
              </Typography>
            )}
          </div>

          <Grid container spacing={2}>
            <DisplaySimpleProperty
              loading={!projectOverviewData}
              label="Project ID"
              value={projectOverviewData?.project.id}
              loadingWidth={100}
              LabelProps={{ color: 'textSecondary' }}
              ValueProps={{ color: 'textPrimary' }}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
            <DisplaySimpleProperty
              loading={!projectOverviewData}
              label="Department ID"
              value={projectOverviewData?.project.departmentId.value}
              loadingWidth={100}
              LabelProps={{ color: 'textSecondary' }}
              ValueProps={{ color: 'textPrimary' }}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
            <DisplaySimpleProperty
              loading={
                !engagements.data ||
                engagements.data.hasMore ||
                !projectOverviewData
              }
              label={isTranslation ? 'Population Total' : 'Total Interns'}
              value={formatNumber(
                isTranslation ? populationTotal : engagements.data?.total
              )}
              loadingWidth={100}
              LabelProps={{ color: 'textSecondary' }}
              ValueProps={{ color: 'textPrimary' }}
              wrap={(node) => (
                <Tooltip
                  title={
                    isTranslation
                      ? engagements.data?.hasMore
                        ? 'Load all engagements below to see the total population'
                        : 'Total population of all languages engaged'
                      : ''
                  }
                >
                  <Grid item>{node}</Grid>
                </Tooltip>
              )}
            />
          </Grid>
          <Grid container spacing={1} alignItems="center">
            <Tooltip
              title={
                isTranslation
                  ? 'Sensitivity is automatically determined by the most sensitive language engaged'
                  : ''
              }
            >
              <Grid item>
                <DataButton
                  loading={!projectOverviewData}
                  onClick={() =>
                    isTranslation === false && editField('sensitivity')
                  }
                  startIcon={
                    <SensitivityIcon
                      value={projectOverviewData?.project.sensitivity}
                      loading={!projectOverviewData}
                      disableTooltip
                    />
                  }
                >
                  {projectOverviewData
                    ? `${projectOverviewData.project.sensitivity} Sensitivity`
                    : null}
                </DataButton>
              </Grid>
            </Tooltip>
            <Grid item>
              <DataButton
                loading={!projectOverviewData}
                secured={locations}
                empty="Enter Location | Field Region"
                redacted="You do not have permission to view location"
                children={locations.value}
                onClick={() =>
                  editField(['primaryLocationId', 'fieldRegionId'])
                }
              />
            </Grid>
            <Grid item>
              <DataButton
                loading={!projectOverviewData}
                startIcon={<DateRange className={classes.infoColor} />}
                secured={date}
                redacted="You do not have permission to view start/end dates"
                children={({ start, end }) => (
                  <FormattedDateRange {...{ start, end }} />
                )}
                empty="Start - End"
                onClick={() => editField(['mouStart', 'mouEnd'])}
              />
            </Grid>
            {projectOverviewData?.project.status === 'InDevelopment' && (
              <Tooltip
                title="Estimated Submission to Regional Director"
                placement="top"
              >
                <Grid item>
                  <DataButton
                    loading={!projectOverviewData}
                    startIcon={<DateRange className={classes.infoColor} />}
                    secured={projectOverviewData.project.estimatedSubmission}
                    redacted="You do not have permission to view estimated submission date"
                    children={(date) => <FormattedDate date={date} />}
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
                onClick={() =>
                  projectOverviewData &&
                  openWorkflow(projectOverviewData.project)
                }
              >
                {displayProjectStep(projectOverviewData?.project.step.value)}
              </DataButton>
            </Grid>
          </Grid>

          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <span {...getRootProps()}>
                <input {...getInputProps()} />
                <Tooltip title="Upload Files">
                  <Fab
                    loading={!projectOverviewData || directoryIdLoading}
                    disabled={canReadDirectoryId === false}
                    onClick={openFileBrowser}
                    color="primary"
                    aria-label="Upload Files"
                  >
                    <Publish />
                  </Fab>
                </Tooltip>
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

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <BudgetOverviewCard
                budget={projectOverviewData?.project.budget.value}
                loading={!projectOverviewData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {/* TODO When file api is finished need to update query and pass in file information */}
              <FilesOverviewCard
                loading={!projectOverviewData}
                total={undefined}
                redacted={canReadDirectoryId === true}
              />
            </Grid>
          </Grid>
          <CardGroup horizontal="md">
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
                {projectOverviewData && engagements.data ? (
                  !engagements.data.canRead ? (
                    <Redacted
                      info="You do not have permission to view engagements"
                      width={400}
                    />
                  ) : (
                    `${engagements.data.total} ${engagementTypeLabel} Engagements`
                  )
                ) : (
                  <Skeleton width={400} />
                )}
              </Typography>
            </Grid>
            <Grid item>
              {engagements.data?.canCreate && (
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
          <List
            {...engagements}
            classes={{
              root: classes.engagementList,
              container: classes.engagementListItems,
            }}
            spacing={3}
            renderItem={(engagement) =>
              engagement.__typename === 'LanguageEngagement' ? (
                <LanguageEngagementListItemCard
                  projectId={projectId}
                  {...engagement}
                />
              ) : (
                <InternshipEngagementListItemCard
                  projectId={projectId}
                  {...engagement}
                />
              )
            }
            skeletonCount={0}
            renderSkeleton={null}
          />
        </div>
      )}
      {workflowProject && (
        <ProjectWorkflowDialog {...workflowState} project={workflowProject} />
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
