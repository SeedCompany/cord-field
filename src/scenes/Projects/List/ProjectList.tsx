import { TabList as ActualTabList, TabContext, TabPanel } from '@mui/lab';
import {
  type Tabs as __Tabs,
  Box,
  Stack,
  Tab,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import { cmpBy, simpleSwitch } from '@seedcompany/common';
import { Helmet } from 'react-helmet-async';
import {
  ProjectStatusLabels,
  ProjectStepLabels,
  ProjectStepList,
  ProjectTypeLabels,
  Sensitivity,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { enumColumn, TableGrid } from '~/components/Grid/Grid';
import { ContentContainer } from '~/components/Layout';
import { Link } from '~/components/Routing';
import { SensitivityIcon } from '~/components/Sensitivity';
import { EnumParam, makeQueryHandler, useTable, withDefault } from '~/hooks';
import {
  ProjectGridDocument,
  ProjectGridItemFragment,
} from './projectList.graphql';

const TabList = ActualTabList as typeof __Tabs;

export const ProjectOverlay = () => {
  return (
    <ContentContainer>
      <Helmet title="Projects" />
      <Typography variant="h2" paragraph>
        Projects
      </Typography>

      <Stack
        component="main"
        sx={{
          flex: 1,
          p: 4,
          overflowY: 'auto',
        }}
      >
        <ProjectTabs />
      </Stack>
    </ContentContainer>
  );
};

const useProjectFilters = makeQueryHandler({
  tab: withDefault(EnumParam(['pinned', 'mine', 'all']), 'pinned'),
});

const ProjectTabs = () => {
  const [filters, setFilters] = useProjectFilters();

  return (
    <Stack
      sx={{
        flex: 1,
        minHeight: 375,
        container: 'main / size',
        '& .MuiTabPanel-root': {
          flex: 1,
          p: 0,
          '&:not([hidden])': {
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <TabContext value={filters.tab}>
        <TabList
          onChange={(_e, tab) => setFilters({ ...filters, tab })}
          aria-label="project navigation tabs"
          variant="scrollable"
        >
          <Tab label="Pinned" value="pinned" />
          <Tab label="Mine" value="mine" />
          <Tab label="All" value="all" />
        </TabList>
        <TabPanel value="pinned">
          <ProjectGrid preset="pinned" />
        </TabPanel>
        <TabPanel value="mine">
          <ProjectGrid preset="mine" />
        </TabPanel>
        <TabPanel value="all">
          <ProjectGrid />
        </TabPanel>
      </TabContext>
    </Stack>
  );
};

interface ProjectGridProps {
  preset?: string;
}

export const ProjectGrid = ({ preset }: ProjectGridProps) => {
  const [props] = useTable({
    query: ProjectGridDocument,
    variables: {
      ...(preset && { input: { filter: { [preset]: true } } }),
    },
    listAt: 'projects',
    initialInput: {
      count: 20,
      sort: 'name',
    },
  });

  return (
    <TableGrid<ProjectGridItemFragment>
      {...props}
      columns={columns}
      tableProps={props}
      hasTabContainer={true}
    />
  );
};

const columns: Array<GridColDef<ProjectGridItemFragment>> = [
  {
    headerName: 'Project Name',
    field: 'name',
    minWidth: 300,
    filterable: false,
    valueGetter: (_, { name }) => name.value,
    renderCell: ({ value, row }) => (
      <Link to={`/projects/${row.id}`}>{value}</Link>
    ),
  },
  {
    headerName: 'Country',
    field: 'primaryLocation.name',
    minWidth: 300,
    filterable: false,
    valueGetter: (_, { primaryLocation }) => primaryLocation.value?.name.value,
  },
  {
    headerName: 'Project Step',
    field: 'project.step',
    width: 250,
    filterable: false,
    valueGetter: (_, row) => row.step.value,
    ...enumColumn(ProjectStepList, ProjectStepLabels, {
      orderByIndex: true,
    }),
  },
  {
    headerName: 'Type',
    field: 'type',
    width: 130,
    filterable: false,
    valueGetter: labelFrom(ProjectTypeLabels),
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 160,
    filterable: false,
    valueGetter: labelFrom(ProjectStatusLabels),
  },
  {
    headerName: 'Engagements',
    field: 'engagements',
    width: 130,
    filterable: false,
    valueGetter: (_, { engagements }) => engagements.total,
  },
  {
    headerName: 'Sensitivity',
    field: 'sensitivity',
    width: 180,
    filterable: false,
    sortComparator: cmpBy<Sensitivity>((v) =>
      simpleSwitch(v, { Low: 0, Medium: 1, High: 2 })
    ),
    renderCell: ({ value }) => (
      <Box display="flex" alignItems="center" gap={1} textTransform="uppercase">
        <SensitivityIcon value={value} disableTooltip />
        {value}
      </Box>
    ),
  },
];
