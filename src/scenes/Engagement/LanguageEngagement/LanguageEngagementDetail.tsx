import {
  Breadcrumbs,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add, DateRange, Edit } from '@material-ui/icons';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { canEditAny, displayEngagementStatus } from '../../../api';
import { BooleanProperty } from '../../../components/BooleanProperty';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DataButton } from '../../../components/DataButton';
import { DefinedFileCard } from '../../../components/DefinedFileCard';
import { useDialog } from '../../../components/Dialog';
import { Fab } from '../../../components/Fab';
import { FileActionsContextProvider } from '../../../components/files/FileActions';
import {
  FormattedDateRange,
  FormattedDateTime,
} from '../../../components/Formatters';
import { LanguageEngagementForm } from '../../../components/LanguageEngagementForm';
import { PeriodicReportCard } from '../../../components/PeriodicReports';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { Link } from '../../../components/Routing';
import { Many } from '../../../util';
import { ProductList } from '../../Products/List/ProductList';
import { DeleteEngagement } from '../Delete';
import {
  EditableEngagementField,
  EditEngagementDialog,
  Engagement,
} from '../EditEngagement/EditEngagementDialog';
import { EngagementWorkflowDialog } from '../EditEngagement/EngagementWorkflowDialog';
import { EngagementQuery } from '../Engagement.generated';
import { UploadLanguageEngagementPnpDocument } from '../Files';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
  },
  nameRedacted: {
    width: '50%',
  },
  infoColor: {
    color: palette.info.main,
  },
  details: {
    marginTop: spacing(4),
  },
  contentColumn: {
    flexFlow: 'column',
  },
  header: {
    fontSize: '24px',
    lineHeight: '32px',
    marginRight: spacing(2),
  },
  addProductBtn: {
    width: 32,
    height: 32,
    minHeight: 32,
  },
}));

export const LanguageEngagementDetail: FC<EngagementQuery> = ({
  project,
  engagement,
}) => {
  const classes = useStyles();

  const [editState, show, editField] =
    useDialog<Many<EditableEngagementField>>();
  const [workflowState, openWorkflow, workflowEngagement] =
    useDialog<Engagement>();

  if (engagement.__typename !== 'LanguageEngagement') {
    return null; // easiest for typescript
  }

  const language = engagement.language.value;
  const langName = language?.name.value ?? language?.displayName.value;
  const ptRegistryId = engagement.paratextRegistryId;
  const editable = canEditAny(engagement);

  return (
    <>
      <Helmet
        title={`${langName ?? 'A Language'} in ${
          project.name.value ?? 'a project'
        }`}
      />
      <div className={classes.root}>
        <Grid
          component="main"
          container
          direction="column"
          spacing={3}
          className={classes.main}
        >
          <Grid item>
            <Breadcrumbs>
              <ProjectBreadcrumb data={project} />
              {langName ? (
                <Breadcrumb to=".">{langName}</Breadcrumb>
              ) : (
                <Redacted
                  info="You do not have permission to view this engagement's name"
                  width={200}
                />
              )}
            </Breadcrumbs>
          </Grid>
          <Grid item container spacing={3} alignItems="center">
            <Grid item className={langName ? undefined : classes.nameRedacted}>
              <Typography
                variant="h2"
                {...(language
                  ? { component: Link, to: `/languages/${language.id}` }
                  : {})}
              >
                {langName ?? (
                  <Redacted
                    info={`You do not have permission to view this engagement's ${
                      language ? 'name' : 'language'
                    }`}
                    width="100%"
                  />
                )}
              </Typography>
            </Grid>
            {editable && (
              <Grid item>
                <Tooltip title="Update First Scripture and Luke Partnership">
                  <Fab
                    color="primary"
                    aria-label="Update language engagement"
                    onClick={() => show(['firstScripture', 'lukePartnership'])}
                  >
                    <Edit />
                  </Fab>
                </Tooltip>
              </Grid>
            )}
            <Grid item>
              <DeleteEngagement project={project} engagement={engagement} />
            </Grid>
          </Grid>
          <Grid item container spacing={3} alignItems="center">
            <Grid item>
              <Typography variant="h4">Language Engagement</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="textSecondary">
                Updated <FormattedDateTime date={engagement.modifiedAt} />
              </Typography>
            </Grid>
          </Grid>
          <Grid item container spacing={1} alignItems="center">
            <Grid item>
              <DataButton
                secured={engagement.status}
                redacted="You do not have permission to view the engagement's status"
                onClick={() => openWorkflow(engagement)}
                children={displayEngagementStatus}
              />
            </Grid>
            <Grid item>
              <DataButton
                startIcon={<DateRange className={classes.infoColor} />}
                secured={engagement.dateRange}
                redacted="You do not have permission to view start/end dates"
                children={(range) => <FormattedDateRange range={range} />}
                empty="Start - End"
                onClick={() => show('dateRangeOverride')}
              />
            </Grid>
            <Grid item>
              <DataButton
                onClick={() => show(['paratextRegistryId'])}
                secured={ptRegistryId}
                redacted="You do not have permission to view Paratext Registry ID"
                children={
                  ptRegistryId.value &&
                  `Paratext Registry ID: ${ptRegistryId.value}`
                }
                empty={'Enter Paratext Registry ID'}
              />
            </Grid>
            <BooleanProperty
              label="First Scripture"
              redacted="You do not have permission to view whether this engagement is the first scripture for this language"
              data={engagement.firstScripture}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
            <BooleanProperty
              label="Luke Partnership"
              redacted="You do not have permission to view whether this engagement is a luke partnership"
              data={engagement.lukePartnership}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
          </Grid>
          <Grid item container spacing={3}>
            <Grid className={classes.contentColumn} item container xs={5}>
              <Grid item container>
                <Typography className={classes.header} variant="h3" paragraph>
                  Latest Report
                </Typography>
              </Grid>
              <FileActionsContextProvider>
                <Grid item container direction="column" spacing={3}>
                  <Grid item container>
                    <PeriodicReportCard
                      type="Progress"
                      dueCurrently={engagement.currentProgressReportDue}
                      dueNext={engagement.nextProgressReportDue}
                    />
                  </Grid>
                  <Grid item container>
                    <Tooltip title="This holds the planning info of PnP files">
                      <Grid item xs={12}>
                        <DefinedFileCard
                          title="Planning Spreadsheet"
                          uploadMutationDocument={
                            UploadLanguageEngagementPnpDocument
                          }
                          parentId={engagement.id}
                          resourceType="engagement"
                          securedFile={engagement.pnp}
                        />
                      </Grid>
                    </Tooltip>
                  </Grid>
                </Grid>
              </FileActionsContextProvider>
              <Grid item container className={classes.details}>
                <Typography className={classes.header} variant="h3" paragraph>
                  Translation Details
                </Typography>
              </Grid>
              <Grid item container>
                <LanguageEngagementForm engagement={engagement} />
              </Grid>
            </Grid>
            <Grid className={classes.contentColumn} item container xs={7}>
              <Grid item container>
                <Typography className={classes.header} variant="h3" paragraph>
                  Products
                </Typography>
                <Link to="./products/create">
                  <Fab
                    className={classes.addProductBtn}
                    color="error"
                    size="small"
                    aria-label="Add New Product"
                  >
                    <Add />
                  </Fab>
                </Link>
              </Grid>
              <Grid item container>
                <ProductList engagement={engagement} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <EditEngagementDialog
        {...editState}
        engagement={engagement}
        editFields={editField}
      />
      {workflowEngagement && (
        <EngagementWorkflowDialog
          {...workflowState}
          engagement={workflowEngagement}
        />
      )}
    </>
  );
};
