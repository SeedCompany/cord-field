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
import { PencilCircledIcon } from '../../../components/Icons';
import {
  LanguageEngagementDetailFragment,
  ProjectBreadcrumbFragment,
} from './LanguageEngagementDetail.generated';

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
  infoColor: {
    color: palette.info.main,
  },
  // main: {
  //   maxWidth: breakpoints.values.md,
  //   '& > *': {
  //     marginBottom: spacing(3),
  //   },
  // },
  // container: {
  //   display: 'flex',
  //   alignItems: 'center',
  // },
  // budgetOverviewCard: {
  //   marginRight: spacing(3),
  // },
  // infoColor: {
  //   color: palette.info.main,
  // },
}));

interface LanguageEngagementDetailProps {
  engagement: LanguageEngagementDetailFragment;
  project: ProjectBreadcrumbFragment;
}

export const LanguageEngagementDetail: FC<LanguageEngagementDetailProps> = ({
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
        </Breadcrumbs>
        <Typography variant="h2">
          {engagement.language.value?.name.value}
          <IconButton color="primary" aria-label="edit partner">
            <PencilCircledIcon />
          </IconButton>
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
              viewLabel="viewlabel"
              // data={{
              //   value: dateFormatter(
              //     new CalendarDate('2020-08-26T10:35:20.646-07:00')
              //   ),
              //   updatedAt: dateFormatter('2020-08-26T10:35:20.646-07:00'),
              //   to: '/home',
              // }}
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Growth Plan Complete Date"
              viewLabel="viewlabel"
              // data={{
              //   value: dateFormatter(
              //     new CalendarDate('2020-08-26T10:35:20.646-07:00')
              //   ),
              //   updatedAt: dateFormatter('2020-08-26T10:35:20.646-07:00'),
              //   to: '/home',
              // }}
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Growth Plan Complete Date"
              viewLabel="viewlabel"
              // data={{
              //   value: dateFormatter(
              //     new CalendarDate('2020-08-26T10:35:20.646-07:00')
              //   ),
              //   updatedAt: dateFormatter('2020-08-26T10:35:20.646-07:00'),
              //   to: '/home',
              // }}
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Growth Plan Complete Date"
              viewLabel="viewlabel"
              // data={{
              //   value: dateFormatter(
              //     new CalendarDate('2020-08-26T10:35:20.646-07:00')
              //   ),
              //   updatedAt: dateFormatter('2020-08-26T10:35:20.646-07:00'),
              //   to: '/home',
              // }}
            />
          </Grid>
        </Grid>
        <Typography variant="h4">Products</Typography>
        Products goes here
      </main>
    </div>
  );
};
