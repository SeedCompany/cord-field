import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Project } from '../../../api';
import { FilterButtonDialog } from '../../../components/Filter';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { List, useListQuery } from '../../../components/List';
import { ProjectListItemCard as ProjectCard } from '../../../components/ProjectListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import {
  ProjectFilterOptions,
  useProjectFilters,
} from './ProjectFilterOptions';
import { ProjectListDocument } from './projects.generated';
import { ProjectSortOptions } from './ProjectSortOptions';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  options: {
    margin: spacing(3, 0),
  },
  items: {
    cardWidth: breakpoints.values.sm,
  },
  item: {
    marginBottom: spacing(2),
  },
}));

export const ProjectList: FC = () => {
  const sort = useSort<Project>();
  const [filters, setFilters] = useProjectFilters();
  const list = useListQuery(ProjectListDocument, {
    listAt: (data) => data.projects,
    variables: {
      input: {
        ...sort.value,
        filter: filters,
      },
    },
  });

  const classes = useStyles();
  const formatNumber = useNumberFormatter();

  return (
    <ContentContainer>
      <Helmet title="Projects" />
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
          <FilterButtonDialog values={filters} onChange={setFilters}>
            <ProjectFilterOptions />
          </FilterButtonDialog>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {list.data ? (
          `${formatNumber(list.data.total)} Projects`
        ) : (
          <Skeleton width="12ch" />
        )}
      </Typography>
      <List
        {...list}
        classes={{ items: classes.items }}
        renderItem={(item) => (
          <ProjectCard key={item.id} project={item} className={classes.item} />
        )}
        renderSkeleton={(index) => (
          <ProjectCard key={index} className={classes.item} />
        )}
      />
    </ContentContainer>
  );
};
