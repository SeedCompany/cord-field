import { Breadcrumbs, Grid, makeStyles, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { CeremonyCard } from '../../components/CeremonyCard';
import { DataButton } from '../../components/DataButton';
import { Fab } from '../../components/Fab';
import { FieldOverviewCard } from '../../components/FieldOverviewCard';
import { ProjectBreadcrumb } from '../../components/ProjectBreadcrumb';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
  },
}));

export const EngagementDetailLoading = () => {
  const classes = useStyles();

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
            <ProjectBreadcrumb />
            <Breadcrumb to=".">
              <Skeleton width={200} />
            </Breadcrumb>
          </Breadcrumbs>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item style={{ width: '50%' }}>
            <Typography variant="h2">
              <Skeleton width="100%" />
            </Typography>
          </Grid>
          <Grid item>
            <Fab loading>
              <Edit />
            </Fab>
          </Grid>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item>
            <Typography variant="h4">
              <Skeleton width={200} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <DataButton loading={true} children={null} />
          </Grid>
          <Grid item>
            <DataButton loading={true} children={null} />
          </Grid>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <FieldOverviewCard />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard />
          </Grid>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <CeremonyCard />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
