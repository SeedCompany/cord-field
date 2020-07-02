import { Breadcrumbs, Grid, makeStyles, Typography } from '@material-ui/core';
import { ChatOutlined, DateRange, Edit } from '@material-ui/icons';
import React, { FC } from 'react';
import {
  canEditAny,
  displayEngagementStatus,
  securedDateRange,
  UpdateLanguageEngagementInput,
} from '../../../api';
import { BooleanProperty } from '../../../components/BooleanProperty';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DataButton } from '../../../components/DataButton';
import { Fab } from '../../../components/Fab';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { useDialog } from '../../../components/Dialog';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import { DateField, SubmitError } from '../../../components/form';
import {
  useDateFormatter,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { OptionsIcon, PlantIcon } from '../../../components/Icons';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { Link } from '../../../components/Routing';
import { CeremonyCard } from '../CeremonyCard';
import { EngagementQuery } from '../Engagement.generated';
import { LanguageEngagementDetailFragment } from './LanguageEngagementDetail.generated';
import { useUpdateLanguageEngagementMutation } from './LanguageEngagementDetail.generated';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
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

  const [state, open] = useDialog();

  const [upadteLanguage] = useUpdateLanguageEngagementMutation();

  const date = securedDateRange(engagement.startDate, engagement.endDate);
  const formatDate = useDateFormatter();
  const formatDateTime = useDateTimeFormatter();

  if (engagement.__typename !== 'LanguageEngagement') {
    return null; // easiest for typescript
  }

  const language = engagement.language.value;
  const langName = language?.name.value ?? language?.displayName.value;
  const editable = canEditAny(engagement);

  return (
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
              <Fab color="primary" aria-label="edit language engagement">
                <Edit />
              </Fab>
            </Grid>
          )}
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
              startIcon={<DateRange className={classes.infoColor} />}
              secured={date}
              redacted="You do not have permission to view start/end dates"
              children={formatDate.range}
              empty="Start - End"
              onClick={open}
            />
          </Grid>
          <Grid item>
            <DataButton>
              {displayEngagementStatus(engagement.status)}
            </DataButton>
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
        <Grid item container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Translation Complete Date"
              data={{
                value: formatDate(engagement.completeDate.value),
              }}
              icon={PlantIcon}
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Disbursement Complete Date"
              data={{
                value: formatDate(engagement.disbursementCompleteDate.value),
              }}
              icon={OptionsIcon}
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Communications Complete Date"
              data={{
                value: formatDate(engagement.communicationsCompleteDate.value),
              }}
              icon={ChatOutlined}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <CeremonyCard
              {...engagement.ceremony}
              onEdit={() => console.log('edit ceremony clicked')}
            />
          </Grid>
        </Grid>
      </Grid>
      <DialogForm<UpdateLanguageEngagementInput>
        {...state}
        title="Change Engagement Start and End Dates"
        closeLabel="Close"
        submitLabel="Change Dates"
        initialValues={{
          engagement: {
            id: engagement.id,
            startDate: engagement.startDate.value,
            endDate: engagement.endDate.value,
          },
        }}
        onSubmit={(input) => {
          upadteLanguage({ variables: { input } });
        }}
      >
        <SubmitError />
        <Typography>Start Date</Typography>
        <DateField name="engagement.startDate" />
        <Typography>Start Date</Typography>
        <DateField name="engagement.endDate" />
      </DialogForm>
    </div>
  );
};
