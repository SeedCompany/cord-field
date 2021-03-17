import { Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { Skeleton, TabContext } from '@material-ui/lab';
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
    maxWidth: breakpoints.values.sm,
  },
  projectTotal: {
    margin: spacing(2, 2),
  },
}));

export const ProjectList: FC = () => {
  const sort = useSort<Project>();
  const [filters, setFilters] = useProjectFilters();
  const getFilters = () => {
    const { tab, ...otherFilters } = filters;
    return {
      ...otherFilters,
      ...(tab === 'mine'
        ? { mine: true }
        : tab === 'pinned'
        ? { pinned: true }
        : {}),
    };
  };
  const list = useListQuery(ProjectListDocument, {
    listAt: (data) => data.projects,
    variables: {
      input: {
        ...sort.value,
        filter: getFilters(),
      },
    },
  });

  const classes = useStyles();
  const formatNumber = useNumberFormatter();

  return (
    <ContentContainer>
      <Helmet title="Projects" />
      <Typography variant="h2" paragraph>
        Projects
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
      <TabContext value={filters.tab}>
        <Tabs
          value={filters.tab}
          onChange={(_e, tab) => setFilters({ ...filters, tab })}
          aria-label="project navigation tabs"
        >
          <Tab label="My Projects" key="mine" value="mine" />
          <Tab label="All" key="all" value="all" />
          <Tab label="Pinned" key="pinned" value="pinned" />
        </Tabs>
        <Typography variant="h3" className={classes.projectTotal}>
          {list.data ? (
            `${formatNumber(list.data.total)} Projects`
          ) : (
            <Skeleton width="12ch" />
          )}
        </Typography>
        <List
          {...list}
          classes={{ container: classes.items }}
          renderItem={(item) => <ProjectCard project={item} />}
          renderSkeleton={<ProjectCard />}
        />
      </TabContext>
    </ContentContainer>
  );
};
