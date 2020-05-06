import { Card, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { useProjectsQuery } from '../../api';
import { ProjectListItemCard } from '../../components/ProjectListItemCard';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(5, 5),
  },
  title: {
    margin: spacing(3, 0),
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    margin: spacing(3, 0),
  },
  optionCard: {
    padding: spacing(1),
    margin: spacing(0, 1),
  },
  content: {
    margin: spacing(3, 0),
  },
  listItem: {
    margin: spacing(1, 0),
  },
  projectItem: {
    margin: spacing(1, 0),
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
      <Typography variant="h2">My Projects</Typography>
      <div className={classes.option}>
        <Card className={classes.optionCard} variant="outlined">
          Sort Options
        </Card>
        <Card className={classes.optionCard} variant="outlined">
          Filter Options
        </Card>
      </div>
      <div className={classes.content}>
        <Typography gutterBottom variant="h3">
          {data?.projects.total} Projects
        </Typography>
        <Grid container direction="column">
          {data?.projects.items.map((item, index) => {
            return <ProjectListItemCard key={index} {...item} />;
          })}
        </Grid>
      </div>
    </div>
  );
};
