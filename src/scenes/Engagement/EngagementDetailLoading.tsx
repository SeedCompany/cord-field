import {
  Breadcrumbs,
  Fab,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Publish } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { DataButton } from '../../components/DataButton';
import { FieldOverviewCard } from '../../components/FieldOverviewCard';

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

interface EngagementDetailLoadingProps {
  projectId: string;
}

export const EngagementDetailLoading: FC<EngagementDetailLoadingProps> = ({
  projectId,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Breadcrumbs>
          <Breadcrumb to={`/projects/${projectId}`}>
            <Skeleton width={200} />
          </Breadcrumb>
        </Breadcrumbs>
        <Typography variant="h2" className={classes.header}>
          <Skeleton width="50%" />
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <DataButton loading={true} children={null} />
          </Grid>
          <Grid item>
            <DataButton loading={true} children={null} />
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Fab color="secondary">
              <Publish />
            </Fab>
          </Grid>
        </Grid>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <FieldOverviewCard title="loading" viewLabel="loading" />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard title="loading" viewLabel="loading" />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard title="loading" viewLabel="loading" />
          </Grid>
        </Grid>
      </main>
    </div>
  );
};
