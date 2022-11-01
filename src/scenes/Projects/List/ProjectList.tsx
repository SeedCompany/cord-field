import { TabList as ActualTabList, TabContext, TabPanel } from '@mui/lab';
import {
  type Tabs as __Tabs,
  Divider,
  Grid,
  Skeleton,
  Tab,
  Typography,
} from '@mui/material';
import { omit, pickBy } from 'lodash';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Project } from '~/api/schema.graphql';
import { simpleSwitch } from '~/common';
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
          }),
        },
      },
    },
  });

  const formatNumber = useNumberFormatter();
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <ContentContainer>
      <Helmet title="Projects" />
      <Typography variant="h2" paragraph>
        Projects
      </Typography>
      <Grid container spacing={1} sx={{ my: 3, mx: 0 }}>
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
          sx={{
            maxWidth: 'sm',
            flexWrap: 'nowrap',
          }}
        >
          <Tab label="Pinned" value="pinned" />
          <Tab label="Mine" value="mine" />
          <Tab label="All" value="all" />
        </TabList>
        <Divider
          sx={{
            maxWidth: 'sm',
            flexWrap: 'nowrap',
          }}
        />
        <TabPanel
          value={filters.tab}
          sx={{
            overflowY: 'auto',
            // allow card shadow to bleed over instead of cutting it off
            py: 0,
            pr: 0,
            pl: 2,
            my: 0,
            mr: 0,
            ml: -2,
          }}
          ref={scrollRef}
        >
          <Typography variant="h3" sx={{ mt: 2 }}>
            {list.data ? (
              `${formatNumber(list.data.total)} Projects`
            ) : (
              <Skeleton width="12ch" />
            )}
          </Typography>
          <List
            {...list}
            itemMaxWidth="sm"
            ContainerProps={{ sx: { flexWrap: 'nowrap' } }}
            renderItem={(item) => <ProjectCard project={item} />}
            renderSkeleton={<ProjectCard />}
            scrollRef={scrollRef}
          />
        </TabPanel>
      </TabContext>
    </ContentContainer>
  );
};
