import {
  Breadcrumbs,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { DateRange } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { securedDateRange } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DataButton } from '../../../components/DataButton';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { useDateFormatter } from '../../../components/Formatters';
import {
  ChatBubbleIcon,
  OptionsIcon,
  PencilCircledIcon,
  PlantIcon,
} from '../../../components/Icons';
import { Redacted } from '../../../components/Redacted';
import { ProjectBreadcrumbFragment } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import { InternshipEngagementDetailFragment } from './InternshipEngagement.generated';

interface InternshipEngagementDetailProps {
  engagement: InternshipEngagementDetailFragment;
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
        </Grid>
        <Typography variant="h4">Products</Typography>
        Product list goes here when ready
      </main>
    </div>
  );
};
