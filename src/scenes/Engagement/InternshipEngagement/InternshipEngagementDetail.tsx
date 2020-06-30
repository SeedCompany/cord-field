import {
  Breadcrumbs,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { DateRange, Publish } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Merge } from 'type-fest';
import { displayInternPosition, securedDateRange } from '../../../api';
import { displayLocation } from '../../../api/location-helper';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { CeremonyCard } from '../../../components/CeremonyCard';
import { DataButton } from '../../../components/DataButton';
import { Fab } from '../../../components/Fab';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { useDateFormatter } from '../../../components/Formatters';
import {
  ChatBubbleIcon,
  OptionsIcon,
  PencilCircledIcon,
  PlantIcon,
} from '../../../components/Icons';
import { MentorCard } from '../../../components/MentorCard';
import { MethodologiesCard } from '../../../components/MethodologiesCard';
import { MethodologyCardFragment } from '../../../components/MethodologiesCard/MethodologiesCard.generated';
import { Redacted } from '../../../components/Redacted';
import { ProjectBreadcrumbFragment } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import { InternshipEngagementDetailFragment } from './InternshipEngagement.generated';

interface InternshipEngagementDetailProps {
  engagement: Merge<
    InternshipEngagementDetailFragment,
    MethodologyCardFragment
  >;
  project: ProjectBreadcrumbFragment;
}

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
    '& > *': {
      marginBottom: spacing(3),
    },
  },
  header: {
    display: 'flex',
  },
  infoColor: {
    color: palette.info.main,
  },
  bottomCardsContainer: {
    '& > *': { marginBottom: spacing(2) },
  },
}));

export const InternshipEngagementDetail: FC<InternshipEngagementDetailProps> = ({
  project,
  engagement,
}) => {
  const classes = useStyles();

  const date = securedDateRange(engagement.startDate, engagement.endDate);
  const formatDate = useDateFormatter();

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Breadcrumbs>
          <Breadcrumb to={`/projects`}>Projects</Breadcrumb>
          <Breadcrumb to={`/projects/${project.id}`}>
            {project.name.value ?? <Skeleton width={200} />}
          </Breadcrumb>
          {engagement.intern.canRead && (
            <Breadcrumb
              to={`/projects/${project.id}/engagements/${engagement.id}`}
            >
              {engagement.intern.value?.fullName}
            </Breadcrumb>
          )}
        </Breadcrumbs>
        <Typography variant="h2" className={classes.header}>
          {engagement.intern.canRead ? (
            engagement.intern.value?.fullName
          ) : (
            <Redacted
              info="You do not have permission to view the internship engagement name"
              width="50%"
            />
          )}
          {engagement.intern.canEdit && (
            <IconButton color="primary" aria-label="edit internship engagement">
              <PencilCircledIcon />
            </IconButton>
          )}
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <DataButton
              size="small"
              color="primary"
              variant="contained"
              secured={engagement.position}
              redacted="You do not have permission to view intern position"
            >
              {displayInternPosition(engagement.position.value)}
            </DataButton>
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <DataButton
              secured={engagement.countryOfOrigin}
              empty="Enter Location"
              redacted="You do not have permission to view location"
              children={displayLocation}
            />
          </Grid>
          <Grid item>
            <DataButton
              startIcon={<DateRange className={classes.infoColor} />}
              secured={date}
              redacted="You do not have permission to view start/end dates"
              children={formatDate.range}
              empty="Start - End"
            />
          </Grid>
          {/* TODO: implement when status fixed
           <Grid item>
            <DataButton>{displayStatus(engagement.status)}</DataButton>
          </Grid> */}
        </Grid>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Fab color="primary" aria-label="Upload Files">
              <Publish />
            </Fab>
          </Grid>
          <Grid item>
            <Typography variant="h4">Upload Files</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Growth Plan Complete Date"
              viewLabel="Edit Complete Date"
              data={{
                value: formatDate(engagement.completeDate.value),
                // updatedAt: engagement.modifiedAt.value,
                to: '/home',
              }}
              icon={PlantIcon}
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Disbursement Complete Date"
              viewLabel="Edit Complete Date"
              data={{
                value: formatDate(engagement.disbursementCompleteDate.value),
                // updatedAt: engagement.modifiedAt.value,
                to: '/home',
              }}
              icon={ChatBubbleIcon}
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Communications Complete Date"
              viewLabel="Edit Complete Date"
              data={{
                value: formatDate(engagement.communicationsCompleteDate.value),
                // updatedAt: engagement.modifiedAt.value,
                to: '/home',
              }}
              icon={OptionsIcon}
            />
          </Grid>
          <Grid item xs={6}>
            <MethodologiesCard
              onEdit={() => null}
              methodologies={engagement.methodologies}
              // TODO: add when modifiedAt is fixed
              // updateTime={engagement.startDate.value}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} className={classes.bottomCardsContainer}>
            <Typography variant="h4">Certification</Typography>
            {engagement.ceremony.value && (
              <CeremonyCard
                {...engagement.ceremony.value}
                canRead={engagement.ceremony.canRead}
                canEdit={engagement.ceremony.canEdit}
                editCeremony={() => console.log('edit ceremony clicked')}
              />
            )}
          </Grid>
          <Grid item xs={6} className={classes.bottomCardsContainer}>
            <Typography variant="h4">Mentor</Typography>
            {engagement.mentor.value && (
              <MentorCard
                {...engagement.mentor.value}
                // TODO: add image when ready in data
                // imageSource="images/favicon-32x32.png"
              />
            )}
          </Grid>
        </Grid>
      </main>
    </div>
  );
};
