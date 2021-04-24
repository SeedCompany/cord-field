import {
  Breadcrumbs,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ChatOutlined, DateRange, Edit } from '@material-ui/icons';
import { last } from 'lodash';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  canEditAny,
  displayEngagementStatus,
  securedDateRange,
} from '../../../api';
import { BooleanProperty } from '../../../components/BooleanProperty';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DataButton } from '../../../components/DataButton';
import { useDialog } from '../../../components/Dialog';
import { Fab } from '../../../components/Fab';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { FileActionsContextProvider } from '../../../components/files/FileActions';
import {
  useDateFormatter,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { OptionsIcon, PlantIcon } from '../../../components/Icons';
import { PeriodicReportSummaryCard } from '../../../components/PeriodicReportSummaryCard';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { Link } from '../../../components/Routing';
import { CalendarDate, Many } from '../../../util';
import { ProductList } from '../../Products/List/ProductList';
import { CeremonyCard } from '../CeremonyCard';
import { DeleteEngagement } from '../Delete';
import {
  EditableEngagementField,
  EditEngagementDialog,
  Engagement,
} from '../EditEngagement/EditEngagementDialog';
import { EngagementWorkflowDialog } from '../EditEngagement/EngagementWorkflowDialog';
import { EngagementQuery } from '../Engagement.generated';

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
}));

export const LanguageEngagementDetail: FC<EngagementQuery> = ({
  project,
  engagement,
}) => {
  const classes = useStyles();

  const [editState, show, editField] = useDialog<
    Many<EditableEngagementField>
  >();
  const [
    workflowState,
    openWorkflow,
    workflowEngagement,
  ] = useDialog<Engagement>();

  const formatDate = useDateFormatter();
  const formatDateTime = useDateTimeFormatter();

  if (engagement.__typename !== 'LanguageEngagement') {
    return null; // easiest for typescript
  }

  const language = engagement.language.value;
  const langName = language?.name.value ?? language?.displayName.value;
  const ptRegistryId = engagement.paratextRegistryId;
  const editable = canEditAny(engagement);

  const date = securedDateRange(engagement.startDate, engagement.endDate);

  const currentQuarterStart = CalendarDate.now().startOf('quarter');
  const progressDueReport =
    engagement.progressReports.items.find(
      (report) => +report.start === +currentQuarterStart
    ) ?? last(engagement.progressReports.items);

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
                Updated {formatDateTime(engagement.modifiedAt)}
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
                secured={date}
                redacted="You do not have permission to view start/end dates"
                children={formatDate.range}
                empty="Start - End"
                onClick={() => show(['startDateOverride', 'endDateOverride'])}
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
            <Grid item xs={6}>
              <FieldOverviewCard
                title="Translation Complete Date"
                data={{
                  value: formatDate(engagement.completeDate.value),
                }}
                icon={PlantIcon}
                onClick={() => show('completeDate')}
                onButtonClick={() => show('completeDate')}
                emptyValue="None"
              />
            </Grid>
            <Grid item xs={6}>
              <FieldOverviewCard
                title="Disbursement Complete Date"
                data={{
                  value: formatDate(engagement.disbursementCompleteDate.value),
                }}
                icon={OptionsIcon}
                onClick={() => show('disbursementCompleteDate')}
                onButtonClick={() => show('disbursementCompleteDate')}
                emptyValue="None"
              />
            </Grid>
            <Grid item xs={6}>
              <FieldOverviewCard
                title="Communications Complete Date"
                data={{
                  value: formatDate(
                    engagement.communicationsCompleteDate.value
                  ),
                }}
                icon={ChatOutlined}
                onClick={() => show('communicationsCompleteDate')}
                onButtonClick={() => show('communicationsCompleteDate')}
                emptyValue="None"
              />
            </Grid>
            <Grid item container spacing={3} alignItems="center">
              <FileActionsContextProvider>
                <Grid item xs={6}>
                  <PeriodicReportSummaryCard
                    reportType="Progress"
                    report={progressDueReport}
                    loading={!progressDueReport}
                    total={engagement.progressReports.total}
                  />
                </Grid>
              </FileActionsContextProvider>
            </Grid>
          </Grid>
          <Grid item container spacing={3} alignItems="center">
            <Grid item xs={6}>
              <CeremonyCard {...engagement.ceremony} />
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h3" paragraph>
              Products
            </Typography>
            <ProductList engagementId={engagement.id} />
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
