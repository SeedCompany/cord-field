import {
  Breadcrumbs,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { DateRange, Edit } from '@material-ui/icons';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { canEditAny, displayEngagementStatus } from '../../../../api';
import { BooleanProperty } from '../../../../components/BooleanProperty';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { DataButton } from '../../../../components/DataButton';
import { useDialog } from '../../../../components/Dialog';
import { Fab } from '../../../../components/Fab';
import {
  FormattedDateRange,
  FormattedDateTime,
} from '../../../../components/Formatters';
import {
  ProjectBreadcrumb,
  ProjectBreadcrumbFragment,
} from '../../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../../components/Redacted';
import { Link } from '../../../../components/Routing';
import { Many } from '../../../../util';
import { DeleteEngagement } from '../../Delete';
import { EngagementToDeleteFragment } from '../../Delete/DeleteEngagement.generated';
import {
  EditableEngagementField,
  EditEngagementDialog,
  Engagement,
} from '../../EditEngagement/EditEngagementDialog';
import { EngagementWorkflowDialog } from '../../EditEngagement/EngagementWorkflowDialog';
import { LanguageEngagementDetailFragment } from '../LanguageEngagementDetail.generated';

const useStyles = makeStyles(({ palette }) => ({
  nameRedacted: {
    width: '50%',
  },
  infoColor: {
    color: palette.info.main,
  },
}));

export const LanguageEngagementHeader = ({
  project,
  engagement,
}: {
  engagement: LanguageEngagementDetailFragment & EngagementToDeleteFragment;
  project: ProjectBreadcrumbFragment;
}) => {
  const classes = useStyles();

  const [editState, show, editField] =
    useDialog<Many<EditableEngagementField>>();
  const [workflowState, openWorkflow, workflowEngagement] =
    useDialog<Engagement>();

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
