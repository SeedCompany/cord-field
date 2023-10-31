import { DateRange, Edit } from '@mui/icons-material';
import { Breadcrumbs, Grid, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { EngagementStatusLabels } from '~/api/schema.graphql';
import { canEditAny, labelFrom, Many } from '~/common';
import { BooleanProperty } from '../../../../components/BooleanProperty';
import { DataButton } from '../../../../components/DataButton';
import { useDialog } from '../../../../components/Dialog';
import { EngagementBreadcrumb } from '../../../../components/EngagementBreadcrumb';
import { Fab } from '../../../../components/Fab';
import {
  FormattedDateRange,
  FormattedDateTime,
} from '../../../../components/Formatters';
import { PresetInventoryIconFilled } from '../../../../components/Icons';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../../components/Redacted';
import { Link } from '../../../../components/Routing';
import { DeleteEngagement } from '../../Delete';
import { EngagementToDeleteFragment } from '../../Delete/DeleteEngagement.graphql';
import {
  EditableEngagementField,
  EditEngagementDialog,
  Engagement,
} from '../../EditEngagement/EditEngagementDialog';
import { EngagementWorkflowDialog } from '../../EditEngagement/EngagementWorkflowDialog';
import { LanguageEngagementDetailFragment } from '../LanguageEngagementDetail.graphql';

const useStyles = makeStyles()(({ palette, spacing }) => ({
  nameRedacted: {
    width: '50%',
  },
  infoColor: {
    color: palette.info.main,
  },
  presetInventory: {
    verticalAlign: 'bottom',
    marginLeft: spacing(1),
  },
}));

export const LanguageEngagementHeader = ({
  engagement,
}: {
  engagement: LanguageEngagementDetailFragment & EngagementToDeleteFragment;
}) => {
  const { classes } = useStyles();

  const [editState, show, editField] =
    useDialog<Many<EditableEngagementField>>();
  const [workflowState, openWorkflow, workflowEngagement] =
    useDialog<Engagement>();

  const language = engagement.language.value;
  const langName =
    language?.name.value ??
    language?.displayName.value ??
    engagement.nameWhenUnknown.value;
  const ptRegistryId = engagement.paratextRegistryId;
  const editable = canEditAny(engagement);

  return (
    <>
      <Helmet
        title={`${langName ?? 'A Language'} in ${
          engagement.project.name.value ?? 'a project'
        }`}
      />
      <Grid item>
        <Breadcrumbs>
          <ProjectBreadcrumb data={engagement.project} />
          <EngagementBreadcrumb data={engagement} />
        </Breadcrumbs>
      </Grid>
      <Grid item>
        <Grid container spacing={3} alignItems="center">
          <Grid item className={langName ? undefined : classes.nameRedacted}>
            {language && !engagement.nameWhenUnknown.value ? (
              <Link variant="h2" to={`/languages/${language.id}`}>
                {langName ?? (
                  <Redacted
                    info="You do not have permission to view this engagement's name"
                    width="100%"
                  />
                )}
              </Link>
            ) : !language && langName ? (
              <Typography variant="h2">{langName}</Typography>
            ) : (
              <Typography variant="h2">
                <Redacted
                  info="You do not have permission to view this engagement's language"
                  width="100%"
                />
              </Typography>
            )}
          </Grid>
          {editable && (
            <Grid item>
              <Tooltip title="Update First Scripture and Luke Partnership">
                <Fab
                  color="primary"
                  aria-label="Update language engagement"
                  onClick={() =>
                    show([
                      'languageId',
                      'firstScripture',
                      'lukePartnership',
                      'openToInvestorVisit',
                    ])
                  }
                >
                  <Edit />
                </Fab>
              </Tooltip>
            </Grid>
          )}
          <Grid item>
            <DeleteEngagement
              project={engagement.project}
              engagement={engagement}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid item container spacing={3} alignItems="center">
          <Grid item>
            <Typography variant="h4">
              Language Engagement
              {engagement.project.presetInventory.value && (
                <Tooltip title="Preset Inventory: Exposed to major investors to directly fund">
                  <PresetInventoryIconFilled
                    color="action"
                    className={classes.presetInventory}
                    aria-label="preset inventory"
                  />
                </Tooltip>
              )}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="body2" color="textSecondary">
              Updated <FormattedDateTime date={engagement.modifiedAt} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container spacing={1} alignItems="center">
        <Grid item>
          <DataButton
            secured={engagement.status}
            redacted="You do not have permission to view the engagement's status"
            onClick={() => openWorkflow(engagement)}
            children={labelFrom(EngagementStatusLabels)}
          />
        </Grid>
        <Grid item>
          <DataButton
            startIcon={<DateRange className={classes.infoColor} />}
            secured={engagement.dateRange}
            redacted="You do not have permission to view start/end dates"
            children={FormattedDateRange.orNull}
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
            empty="Enter Paratext Registry ID"
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
        <BooleanProperty
          label="Open to Investor Visit"
          redacted="You do not have permission to view whether this engagement is open to investor visit"
          data={engagement.openToInvestorVisit}
          wrap={(node) => <Grid item>{node}</Grid>}
        />
      </Grid>
      <EditEngagementDialog
        {...editState}
        engagement={engagement}
        project={engagement.project}
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
