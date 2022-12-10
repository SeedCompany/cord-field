import { useQuery } from '@apollo/client';
import { Add, DateRange, Edit, Publish } from '@mui/icons-material';
import { Grid, Skeleton, Tooltip, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { PartialDeep } from 'type-fest';
import { ProjectStepLabels } from '~/api/schema.graphql';
import { labelFrom, Many } from '~/common';
import { BudgetOverviewCard } from '../../../components/BudgetOverviewCard';
import { CardGroup } from '../../../components/CardGroup';
import { ChangesetPropertyBadge } from '../../../components/Changeset';
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
import { useProjectCurrentDirectory, useUploadProjectFiles } from '../Files';
import { ProjectListQueryVariables } from '../List/projects.graphql';
import { EditableProjectField, UpdateProjectDialog } from '../Update';
import { ProjectWorkflowDialog } from '../Update/ProjectWorkflowDialog';
import { useProjectId } from '../useProjectId';
import { PresetInventoryButton } from './PresetInventory';
import {
  ProjectEngagementListOverviewDocument as EngagementList,
  ProjectOverviewDocument,
  ProjectOverviewFragment,
} from './ProjectOverview.graphql';
import { ProjectPostList } from './ProjectPostList';

type EngagementListItem =
  | LanguageEngagementListItemFragment
  | InternshipEngagementListItemFragment;

const useStyles = makeStyles()(({ spacing, breakpoints, palette }) => ({
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
  },
  headerLoading: {
    alignItems: 'center',
  },
  name: {
    marginRight: spacing(2), // a little extra between text and buttons
    lineHeight: 'inherit', // centers text with buttons better
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

  const [editState, editField, fieldsBeingEdited] =
    useDialog<Many<EditableProjectField>>();
  const [workflowState, openWorkflow, workflowProject] =
    useDialog<ProjectOverviewFragment>();

  const {
    directoryId,
    loading: directoryIdLoading,
    canRead: canReadDirectoryId,
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

  const { data: projectOverviewData, error } = useQuery(
    ProjectOverviewDocument,
    {
      variables: {
        input: projectId,
        changeset: changesetId,
      },
    }
  );

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
            className={cx(
              classes.header,
              projectOverviewData ? null : classes.headerLoading
            )}
          >
            <Typography
              variant="h2"
              className={cx(
                classes.name,
                projectName ? null : classes.nameLoading
              )}
            >
              {!projectName ? (
                <Skeleton width="100%" />
              ) : projectName.canRead ? (
                <ChangesetPropertyBadge
                  current={projectOverviewData.project}
                  prop="name"
                >
                  {projectName.value}
                </ChangesetPropertyBadge>
              ) : (
                <Redacted
                  info="You do not have permission to view project's name"
                  width="50%"
                />
              )}
            </Typography>
            <PresetInventoryButton project={projectOverviewData?.project} />
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
              listFilter={(args: PartialDeep<ProjectListQueryVariables>) =>
                args.input?.filter?.pinned ?? false
              }
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
              <ChangesetPropertyBadge
                current={projectOverviewData?.project}
                prop="mouRange"
                identifyBy={(range) =>
                  `${range.start?.toMillis()}/${range.end?.toMillis()}`
                }
                labelBy={({ start, end }) => (
                  <FormattedDateRange start={start} end={end} />
                )}
              >
                <DataButton
                  loading={!projectOverviewData}
                  startIcon={<DateRange className={classes.infoColor} />}
                  secured={projectOverviewData?.project.mouRange}
                  redacted="You do not have permission to view start/end dates"
                  children={FormattedDateRange.orNull}
                  empty="Start - End"
                  onClick={() => editField('mouRange')}
                />
              </ChangesetPropertyBadge>
            </Grid>
            {projectOverviewData?.project.projectStatus === 'InDevelopment' && (
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
              <ChangesetPropertyBadge
                current={projectOverviewData?.project}
                prop="step"
                labelBy={labelFrom(ProjectStepLabels)}
              >
                <DataButton
                  loading={!projectOverviewData}
                  secured={projectOverviewData?.project.step}
                  redacted="You do not have permission to view project step"
                  onClick={() =>
                    projectOverviewData &&
                    openWorkflow(projectOverviewData.project)
                  }
                >
                  {labelFrom(ProjectStepLabels)(
                    projectOverviewData?.project.step.value
                  )}
                </DataButton>
              </ChangesetPropertyBadge>
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

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PeriodicReportCard
                type="Financial"
                dueCurrently={
                  projectOverviewData?.project.currentFinancialReportDue
                }
                dueNext={projectOverviewData?.project.nextFinancialReportDue}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PeriodicReportCard
                type="Narrative"
                dueCurrently={
                  projectOverviewData?.project.currentNarrativeReportDue
                }
                dueNext={projectOverviewData?.project.nextNarrativeReportDue}
              />
            </Grid>
          </Grid>

          <CardGroup horizontal="mdUp">
            <ProjectMembersSummary
              members={projectOverviewData?.project.team}
            />
            <PartnershipSummary
              partnerships={projectOverviewData?.project.partnerships}
            />
          </CardGroup>

          {beta.has('projectChangeRequests') && (
            <Grid container spacing={3}>
              <Grid item sm={12} md={6}>
                <ProjectChangeRequestSummary
                  data={projectOverviewData?.project.changeRequests}
                />
              </Grid>
            </Grid>
          )}

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
          {!!projectOverviewData?.project && (
            <ProjectPostList project={projectOverviewData.project} />
          )}
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
      {projectOverviewData && (
        <CreateEngagement
          project={projectOverviewData.project}
          {...createEngagementState}
        />
      )}
    </main>
  );
};
