import { TabList as ActualTabList, TabContext, TabPanel } from '@mui/lab';
import {
  type Tabs as __Tabs,
  Divider,
  Grid,
  Skeleton,
  Tab,
  Typography,
} from '@mui/material';
import { simpleSwitch } from '@seedcompany/common';
import { omit, pickBy } from 'lodash';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { Project } from '~/api/schema.graphql';
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
import { ProjectListDocument } from './projects.graphql';
import { ProjectSortOptions } from './ProjectSortOptions';

const TabList = ActualTabList as typeof __Tabs;

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  options: {
    margin: spacing(3, 0),
  },
  maxWidth: {
    maxWidth: breakpoints.values.sm,
    flexWrap: 'nowrap',
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

export const ProjectList = () => {
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
            all: {},
          }),
        },
      },
    },
  });

  const { classes } = useStyles();
  const formatNumber = useNumberFormatter();
  const scrollRef = useRef<HTMLElement>(null);

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
          <FilterButtonDialog
            values={pickBy(omit(filters, 'tab'))}
            onChange={setFilters}
          >
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
        <TabPanel
          value={filters.tab}
          className={classes.tabPanel}
          ref={scrollRef}
        >
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
            scrollRef={scrollRef}
          />
        </TabPanel>
      </TabContext>
    </ContentContainer>
  );
};
