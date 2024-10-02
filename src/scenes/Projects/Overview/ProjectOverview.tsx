import { useQuery } from '@apollo/client';
import {
  Add,
  DateRange as DateRangeIcon,
  Edit,
  Event as EventIcon,
  TravelExplore as GlobalSearchIcon,
  Public as GlobeIcon,
  Place as MapPinIcon,
  Publish,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { Chip, Grid, Skeleton, Tooltip, Typography } from '@mui/material';
import { Many } from '@seedcompany/common';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { PartialDeep } from 'type-fest';
import { ProjectStepLabels, ProjectTypeLabels } from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { ToggleCommentsButton } from '~/components/Comments/ToggleCommentButton';
import { BudgetOverviewCard } from '../../../components/BudgetOverviewCard';
import { CardGroup } from '../../../components/CardGroup';
import { ChangesetPropertyBadge } from '../../../components/Changeset';
import { useComments } from '../../../components/Comments/CommentsContext';
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
import { InternshipEngagementListItemFragment } from '../../../components/InternshipEngagementListItemCard/InternshipEngagementListItem.graphql';
import { LanguageEngagementListItemCard } from '../../../components/LanguageEngagementListItemCard';
import { LanguageEngagementListItemFragment } from '../../../components/LanguageEngagementListItemCard/LanguageEngagementListItem.graphql';
import { List, useListQuery } from '../../../components/List';
import { PartnershipSummary } from '../../../components/PartnershipSummary';
import { PeriodicReportCard } from '../../../components/PeriodicReports';
import { ProjectChangeRequestSummary } from '../../../components/ProjectChangeRequestSummary';
import { ProjectMembersSummary } from '../../../components/ProjectMembersSummary';
import { Redacted } from '../../../components/Redacted';
import { SensitivityIcon } from '../../../components/Sensitivity';
import { useBetaFeatures } from '../../../components/Session';
import { TogglePinButton } from '../../../components/TogglePinButton';
import { CreateInternshipEngagement } from '../../Engagement/InternshipEngagement/Create/CreateInternshipEngagement';
import { CreateLanguageEngagement } from '../../Engagement/LanguageEngagement/Create/CreateLanguageEngagement';
import { DeleteProject } from '../Delete';
import { useProjectCurrentDirectory, useUploadProjectFiles } from '../Files';
import { ProjectListQueryVariables } from '../List/ProjectList.graphql';
import { EditableProjectField, UpdateProjectDialog } from '../Update';
import { ProjectWorkflowDialog } from '../Update/ProjectWorkflowDialog';
import { useProjectId } from '../useProjectId';
import { WorkflowEventsDrawer, WorkflowEventsIcon } from '../WorkflowEvents';
import {
  ProjectEngagementListOverviewDocument as EngagementList,
  ProjectOverviewDocument,
  ProjectOverviewFragment,
} from './ProjectOverview.graphql';
import { ProjectPostList } from './ProjectPostList';

type EngagementListItem =
  | LanguageEngagementListItemFragment
  | InternshipEngagementListItemFragment;

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
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
    gap: spacing(1),
    alignItems: 'center',
  },
  name: {
    marginRight: spacing(2), // a little extra between text and buttons
    // centers text with buttons better
    lineHeight: 'inherit',
    alignSelf: 'flex-start',
  },
  nameLoading: {
    width: '30%',
    alignSelf: 'initial',
  },
  subheader: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginRight: spacing(2),
    },
  },
  engagementList: {
    // fix spacing above applied with > *
    marginTop: spacing(-3),
    // marginRight: -16,
    // padding: 0,
  },
  engagementListItems: {
    maxWidth: 492,
  },
}));

export const ProjectOverview = () => {
  const { classes, cx } = useStyles();
  const { projectId, changesetId } = useProjectId();
  const beta = useBetaFeatures();
  const formatNumber = useNumberFormatter();
  const [workflowDrawerState, openWorkflowEvents] = useDialog();

  const [editState, editField, fieldsBeingEdited] =
    useDialog<Many<EditableProjectField>>();
  const [workflowState, openWorkflow, workflowProject] =
    useDialog<ProjectOverviewFragment>();

  const {
    directoryId,
    loading: directoryLoading,
    canRead: canReadDirectory,
    project: projectDirectoryInfo,
  } = useProjectCurrentDirectory();
  const uploadProjectFiles = useUploadProjectFiles();

  const handleDrop = (files: File[]) => {
    uploadProjectFiles({ files, parentId: directoryId });
  };

  const {
    getRootProps,
    getInputProps,
    open: openFileBrowser,
  } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
    disabled: !directoryId,
  });

  const [createEngagementState, createEngagement] = useDialog();

  const { data: { project } = { project: undefined }, error } = useQuery(
    ProjectOverviewDocument,
    {
      variables: {
        input: projectId,
        changeset: changesetId,
      },
    }
  );
  useComments(projectId);

  const engagements = useListQuery(EngagementList, {
    listAt: (data) => data.project.engagements,
    changesetRemovedItems: (obj): obj is EngagementListItem =>
      obj.__typename === 'LanguageEngagement' ||
      obj.__typename === 'InternshipEngagement',
    variables: {
      project: projectId,
      changeset: changesetId,
    },
  });

  const isTranslation = project
    ? project.__typename !== 'InternshipProject'
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

  const CreateEngagement = isTranslation
    ? CreateLanguageEngagement
    : CreateInternshipEngagement;

  return (
    <main className={classes.root}>
      <Helmet title={project?.name.value ?? undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find project',
          Default: 'Error loading project',
        }}
      </Error>
      {!error && (
        <div className={classes.main}>
          <header className={classes.header}>
            <Typography
              variant="h2"
              className={cx(classes.name, project ? null : classes.nameLoading)}
            >
              {!project ? (
                <Skeleton width="100%" />
              ) : project.name.canRead ? (
                <ChangesetPropertyBadge current={project} prop="name">
                  {project.name.value}
                </ChangesetPropertyBadge>
              ) : (
                <Redacted
                  info="You do not have permission to view project's name"
                  width="50%"
                />
              )}
            </Typography>
            {project && (
              <Chip
                label={labelFrom(ProjectTypeLabels)(project.type)}
                variant="outlined"
              />
            )}
            {(!project || project.name.canEdit) && (
              <Tooltip title="Edit Project Name">
                <IconButton
                  aria-label="edit project name"
                  onClick={() => editField(['name'])}
                  loading={!project}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            <TogglePinButton
              object={project}
              label="Project"
              listId="projects"
              listFilter={(args: PartialDeep<ProjectListQueryVariables>) =>
                args.input?.filter?.pinned ?? false
              }
            />
            <ToggleCommentsButton loading={!project} />
            {project && <DeleteProject project={project} />}
            {project && (
              <WorkflowEventsIcon
                onClick={openWorkflowEvents}
                loading={!project}
              />
            )}
          </header>

          <div className={classes.subheader}>
            <Typography variant="h4">
              {project ? 'Project Overview' : <Skeleton width={200} />}
            </Typography>
            {project && (
              <Typography variant="body2" color="textSecondary">
                Updated <FormattedDateTime date={project.modifiedAt} />
              </Typography>
            )}
          </div>

          <Grid container spacing={2}>
            <DisplaySimpleProperty
              loading={!project}
              label="Project ID"
              value={project?.id}
              loadingWidth={100}
              LabelProps={{ color: 'textSecondary' }}
              ValueProps={{ color: 'textPrimary' }}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
            <DisplaySimpleProperty
              loading={!project}
              label="Department ID"
              value={project?.departmentId.value}
              loadingWidth={100}
              LabelProps={{ color: 'textSecondary' }}
              ValueProps={{ color: 'textPrimary' }}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
            <DisplaySimpleProperty
              loading={
                !engagements.data || engagements.data.hasMore || !project
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
                  label="Sensitivity"
                  loading={!project}
                  onClick={() =>
                    isTranslation === false && editField('sensitivity')
                  }
                  startIcon={
                    <SensitivityIcon
                      value={project?.sensitivity}
                      loading={!project}
                      disableTooltip
                    />
                  }
                >
                  {project?.sensitivity}
                </DataButton>
              </Grid>
            </Tooltip>
            <Grid item>
              <ChangesetPropertyBadge
                current={project}
                prop="step"
                labelBy={labelFrom(ProjectStepLabels)}
              >
                <DataButton
                  label="Status"
                  startIcon={<TimelineIcon color="info" />}
                  loading={!project}
                  secured={project?.step}
                  redacted="You do not have permission to view project step"
                  onClick={() => project && openWorkflow(project)}
                >
                  {labelFrom(ProjectStepLabels)(project?.step.value)}
                </DataButton>
              </ChangesetPropertyBadge>
            </Grid>
            <Grid item>
              <ChangesetPropertyBadge
                current={project}
                prop="mouRange"
                identifyBy={(range) =>
                  `${range.start?.toMillis()}/${range.end?.toMillis()}`
                }
                labelBy={({ start, end }) => (
                  <FormattedDateRange start={start} end={end} />
                )}
              >
                <DataButton
                  label="Start - End"
                  startIcon={<DateRangeIcon color="info" />}
                  empty="None"
                  loading={!project}
                  secured={project?.mouRange}
                  redacted="You do not have permission to view start/end dates"
                  children={FormattedDateRange.orNull}
                  onClick={() => editField('mouRange')}
                />
              </ChangesetPropertyBadge>
            </Grid>
            {project?.projectStatus === 'InDevelopment' && (
              <Tooltip
                title="Estimated Submission to Regional Director"
                placement="top"
              >
                <Grid item>
                  <DataButton
                    label="Est. Submission"
                    startIcon={<EventIcon color="info" />}
                    empty="None"
                    loading={!project}
                    secured={project.estimatedSubmission}
                    redacted="You do not have permission to view estimated submission date"
                    children={(date) => <FormattedDate date={date} />}
                    onClick={() => editField(['estimatedSubmission'])}
                  />
                </Grid>
              </Tooltip>
            )}
          </Grid>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <DataButton
                label="Primary Location"
                startIcon={<MapPinIcon color="info" />}
                empty="None"
                loading={!project}
                secured={project?.primaryLocation}
                redacted="You do not have permission to view primary location"
                children={(location) => location.name.value}
                onClick={() => editField('primaryLocationId')}
              />
            </Grid>
            <Grid item>
              <DataButton
                label="Field Region"
                startIcon={<GlobeIcon color="info" />}
                empty="None"
                loading={!project}
                secured={project?.fieldRegion}
                redacted="You do not have permission to view field region"
                children={(location) => location.name.value}
                onClick={() => editField('fieldRegionId')}
              />
            </Grid>
            <Grid item>
              <DataButton
                label="Marketing Location"
                startIcon={<GlobalSearchIcon color="info" />}
                empty="None"
                loading={!project}
                secured={project?.marketingLocation}
                redacted="You do not have permission to view the marketing location"
                children={(location) => location.name.value}
                onClick={() => editField(['marketingLocationId'])}
              />
            </Grid>
          </Grid>

          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <span {...getRootProps()}>
                <input {...getInputProps()} />
                <Tooltip title="Upload Files">
                  <Fab
                    loading={!project || directoryLoading}
                    disabled={canReadDirectory === false}
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
                {project ? 'Upload Files' : <Skeleton width="12ch" />}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <BudgetOverviewCard
                budget={project?.budget.value}
                loading={!project}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {/* TODO When file api is finished need to update query and pass in file information */}
              <FilesOverviewCard
                loading={!project || directoryLoading}
                redacted={canReadDirectory === false}
                total={projectDirectoryInfo?.rootDirectory.value?.totalFiles}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PeriodicReportCard
                type="Financial"
                dueCurrently={project?.currentFinancialReportDue}
                dueNext={project?.nextFinancialReportDue}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PeriodicReportCard
                type="Narrative"
                dueCurrently={project?.currentNarrativeReportDue}
                dueNext={project?.nextNarrativeReportDue}
              />
            </Grid>
          </Grid>

          <CardGroup horizontal="mdUp">
            <ProjectMembersSummary members={project?.team} />
            <PartnershipSummary partnerships={project?.partnerships} />
          </CardGroup>

          {beta.has('projectChangeRequests') && (
            <Grid container spacing={3}>
              <Grid item sm={12} md={6}>
                <ProjectChangeRequestSummary data={project?.changeRequests} />
              </Grid>
            </Grid>
          )}

          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="h3">
                {project && engagements.data ? (
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
              {(!engagements.data || engagements.data.canCreate) && (
                <Tooltip
                  title={
                    engagementTypeLabel
                      ? `Add ${engagementTypeLabel} Engagement`
                      : ''
                  }
                >
                  <Fab
                    color="error"
                    aria-label={`Add ${
                      engagementTypeLabel ? engagementTypeLabel + ' ' : ''
                    }Engagement`}
                    onClick={createEngagement}
                    loading={!engagements.data}
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
            // ItemProps={{ sm: 12, md: 6 }}
            renderItem={(engagement) =>
              engagement.__typename === 'LanguageEngagement' ? (
                <LanguageEngagementListItemCard {...engagement} />
              ) : (
                <InternshipEngagementListItemCard {...engagement} />
              )
            }
            skeletonCount={0}
            renderSkeleton={null}
          />
          {!!project && <ProjectPostList project={project} />}
        </div>
      )}
      {workflowProject && (
        <ProjectWorkflowDialog {...workflowState} project={workflowProject} />
      )}
      {project ? (
        <UpdateProjectDialog
          {...editState}
          project={project}
          editFields={fieldsBeingEdited}
        />
      ) : null}
      {project && (
        <CreateEngagement project={project} {...createEngagementState} />
      )}
      {project && (
        <WorkflowEventsDrawer
          {...workflowDrawerState}
          events={project.workflowEvents}
        />
      )}
    </main>
  );
};
