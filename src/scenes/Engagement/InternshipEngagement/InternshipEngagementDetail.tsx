import { Breadcrumbs, Grid, makeStyles, Typography } from '@material-ui/core';
import { ChatOutlined, DateRange, Edit } from '@material-ui/icons';
import React, { FC } from 'react';
import {
  canEditAny,
  displayEngagementStatus,
  displayInternPosition,
  securedDateRange,
} from '../../../api';
import { displayLocation } from '../../../api/location-helper';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DataButton } from '../../../components/DataButton';
import { useDialog } from '../../../components/Dialog';
import { Fab } from '../../../components/Fab';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import {
  useDateFormatter,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { OptionsIcon, PlantIcon } from '../../../components/Icons';
import { MethodologiesCard } from '../../../components/MethodologiesCard';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { Link } from '../../../components/Routing';
import { CeremonyCard } from '../CeremonyCard';
import { EditEngagementDialog } from '../EditEngagement/EditEngagementDialog';
import { EngagementQuery } from '../Engagement.generated';
import { MentorCard } from './MentorCard';

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

export const InternshipEngagementDetail: FC<EngagementQuery> = ({
  project,
  engagement,
}) => {
  const classes = useStyles();
  const [state, show, editValue] = useDialog<string>();

  const date = securedDateRange(engagement.startDate, engagement.endDate);
  const formatDate = useDateFormatter();
  const formatDateTime = useDateTimeFormatter();

  if (engagement.__typename !== 'InternshipEngagement') {
    return null; // easiest for typescript
  }

  const intern = engagement.intern.value;
  const name = intern?.fullName;
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
            {name ? (
              <Breadcrumb to=".">{name}</Breadcrumb>
            ) : (
              <Redacted
                info="You do not have permission to view this engagement's name"
                width={200}
              />
            )}
          </Breadcrumbs>
        </Grid>

        <Grid item container spacing={3} alignItems="center">
          <Grid item className={name ? undefined : classes.nameRedacted}>
            <Typography
              variant="h2"
              {...(intern
                ? { component: Link, to: `/users/${intern.id}` }
                : {})}
            >
              {name ?? (
                <Redacted
                  info={`You do not have permission to view this engagement's ${
                    intern ? 'name' : 'intern'
                  }`}
                  width="100%"
                />
              )}
            </Typography>
          </Grid>
          {editable && (
            <Grid item>
              <Fab color="primary" aria-label="edit internship engagement">
                <Edit />
              </Fab>
            </Grid>
          )}
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item>
            <Typography variant="h4">Internship Engagement</Typography>
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
              secured={engagement.position}
              empty="Enter Intern Position"
              redacted="You do not have permission to view intern position"
              children={displayInternPosition}
              onClick={() => show('position')}
            />
          </Grid>
          <Grid item>
            <DataButton
              secured={engagement.countryOfOrigin}
              empty="Enter Country of Origin"
              redacted="You do not have permission to view country of origin"
              children={displayLocation}
              onClick={() => show('countryOfOrigin')}
            />
          </Grid>
          <Grid item>
            <DataButton
              startIcon={<DateRange className={classes.infoColor} />}
              secured={date}
              redacted="You do not have permission to view start/end dates"
              children={formatDate.range}
              empty="Start - End"
              onClick={() => show('startEndDate')}
            />
          </Grid>
          <Grid item>
            <DataButton>
              {displayEngagementStatus(engagement.status)}
            </DataButton>
          </Grid>
        </Grid>
        <Grid item container spacing={3}>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Growth Plan Complete Date"
              data={{
                value: formatDate(engagement.completeDate.value),
              }}
              icon={PlantIcon}
              onClick={() => show('completeDate')}
              onButtonClick={() => show('completeDate')}
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
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Communications Complete Date"
              data={{
                value: formatDate(engagement.communicationsCompleteDate.value),
              }}
              icon={ChatOutlined}
              onClick={() => show('communicationsCompleteDate')}
              onButtonClick={() => show('communicationsCompleteDate')}
            />
          </Grid>
          <Grid item xs={6}>
            <MethodologiesCard
              onClick={() => show('methodologies')}
              data={engagement.methodologies}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={3}>
          <Grid item xs={6}>
            <CeremonyCard {...engagement.ceremony} />
          </Grid>
          <MentorCard
            data={engagement.mentor}
            wrap={(node) => (
              <Grid item xs={6}>
                {node}
              </Grid>
            )}
            //TODO: implement
            // editMentor={() => show('mentor')}
          />
        </Grid>
      </Grid>
      <EditEngagementDialog
        {...state}
        engagement={engagement}
        editValue={editValue}
      />
    </div>
  );
};
