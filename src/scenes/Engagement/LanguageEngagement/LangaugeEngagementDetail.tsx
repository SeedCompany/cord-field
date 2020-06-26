import {
  Breadcrumbs,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { PencilCircledIcon } from '../../../components/Icons';
import {
  LanguageEngagementDetailFragment,
  ProjectBreadcrumbFragment,
} from './LanguageEngagementDetail.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
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
}) => {
  const classes = useStyles();
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
          {/* TODO: when name query fixed show real name */}
          Placeholder Name
          <IconButton color="primary" aria-label="edit partner">
            <PencilCircledIcon />
          </IconButton>
        </Typography>
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
