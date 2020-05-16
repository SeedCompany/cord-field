import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { times } from 'lodash';
import React, { FC } from 'react';
import { Project } from '../../api';
import { ProjectListItemCard } from '../../components/ProjectListItemCard';
import { SortButtonDialog, useSort } from '../../components/Sort';
import { useProjectsQuery } from './projects.generated';
import { ProjectSortOptions } from './ProjectSortOptionsDialog';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  options: {
    margin: spacing(3, 0),
  },
}));

export const ProjectList: FC = () => {
  const sort = useSort<Project>();

  const { loading, data } = useProjectsQuery({
    variables: {
      input: {
        ...sort.value,
      },
    },
  });
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h2" paragraph>
        My Projects
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <SortButtonDialog {...sort}>
            <ProjectSortOptions />
          </SortButtonDialog>
        </Grid>
        <Grid item>
          <Button variant="outlined">Filter Options</Button>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {data?.projects.total} Projects
      </Typography>
      <Grid container direction="column" spacing={2}>
        {loading
          ? times(5).map((index) => (
              <Grid item key={index}>
                <ProjectListItemCard />
              </Grid>
            ))
          : data?.projects.items.map((item) => (
              <Grid item key={item.id}>
                <ProjectListItemCard project={item} />
              </Grid>
            ))}
      </Grid>
    </div>
  );
};
