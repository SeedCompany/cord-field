import { Divider, Grid, makeStyles, Tab, Typography } from '@material-ui/core';
import { Skeleton, TabContext, TabList, TabPanel } from '@material-ui/lab';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Project } from '../../../api';
import { FilterButtonDialog } from '../../../components/Filter';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { List, useListQuery } from '../../../components/List';
import { ProjectListItemCard as ProjectCard } from '../../../components/ProjectListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { simpleSwitch } from '../../../util';
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
  maxWidth: {
    maxWidth: breakpoints.values.sm,
  },
  tabPanel: {
    overflowY: 'auto',
    // allow card shadow to bleed over instead of cutting it off
    padding: spacing(0, 0, 0, 2),
    margin: spacing(0, 0, 0, -2),
  },
  total: {
    marginTop: spacing(2),
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
        filter: {
          ...omit(filters, 'tab'),
          ...simpleSwitch(filters.tab, {
            mine: { mine: true },
            pinned: { pinned: true },
          }),
        },
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
        <TabList
          onChange={(_e, tab) => setFilters({ ...filters, tab })}
          aria-label="project navigation tabs"
          className={classes.maxWidth}
        >
          <Tab label="Pinned" value="pinned" />
          <Tab label="Mine" value="mine" />
          <Tab label="All" value="all" />
        </TabList>
        <Divider className={classes.maxWidth} />
        <TabPanel value={filters.tab} className={classes.tabPanel}>
          <Typography variant="h3" className={classes.total}>
            {list.data ? (
              `${formatNumber(list.data.total)} Projects`
            ) : (
              <Skeleton width="12ch" />
            )}
          </Typography>
          <List
            {...list}
            classes={{ container: classes.maxWidth }}
            renderItem={(item) => <ProjectCard project={item} />}
            renderSkeleton={<ProjectCard />}
          />
        </TabPanel>
      </TabContext>
    </ContentContainer>
  );
};
