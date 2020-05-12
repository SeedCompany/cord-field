import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { useProjectsQuery } from '../../api';
import { ProjectListItemCard } from '../../components/ProjectListItemCard';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(5),
  },
  options: {
    margin: spacing(3, 0),
  },
}));

export const ProjectList: FC = () => {
  const { loading, data } = useProjectsQuery({
    variables: {
      input: {},
    },
  });
  const classes = useStyles();

  if (loading) {
    return <div className={classes.root}>Loading...</div>;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h2" paragraph>
        My Projects
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <Button variant="outlined">Sort Options</Button>
        </Grid>
        <Grid item>
          <Button variant="outlined">Filter Options</Button>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {data?.projects.total} Projects
      </Typography>
      <Grid container direction="column" spacing={2}>
        {data?.projects.items.map((item) => (
          <Grid item key={item.id}>
            <ProjectListItemCard {...item} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
