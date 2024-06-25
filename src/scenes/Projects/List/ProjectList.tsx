import { TabList as ActualTabList, TabContext, TabPanel } from '@mui/lab';
import {
  type Tabs as __Tabs,
  Box,
  Stack,
  Tab,
  Typography,
} from '@mui/material';
import {
  DataGridPro as DataGrid,
  getGridSingleSelectOperators,
  GridColDef,
} from '@mui/x-data-grid-pro';
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
import { TabContainer } from '~/components/Grid/TabContainer';
import { ContentContainer } from '~/components/Layout';
import { Link } from '~/components/Routing';
import { SensitivityIcon } from '~/components/Sensitivity';
import { EnumParam, makeQueryHandler, useTable, withDefault } from '~/hooks';
import {
  ProjectGridDocument,
  ProjectGridItemFragment,
} from './projects.graphql';

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
    variables: {},
    listAt: 'projects',
    initialInput: {
      count: 4,
      sort: 'name',
    },
    ...(preset && { presetFilters: { [preset]: true } }),
  });

  return (
    <TabContainer
      sx={{
        p: 0,
        maxWidth: '100cqw',
        width: 'min-content',
      }}
    >
      <DataGrid<ProjectGridItemFragment>
        density="compact"
        columns={columns}
        {...props}
        disableRowSelectionOnClick
        headerFilters
        headerFilterHeight={90}
        initialState={{
          pinnedColumns: {
            // Flaky with our current layout.
            // MUI doesn't render it a lot of the times.
            // left: ['nameProjectFirst'],
          },
        }}
        sx={{
          // Hide filter operator button since there aren't multiple operators
          '.MuiDataGrid-headerFilterRow .MuiDataGrid-columnHeader button': {
            display: 'none',
          },
        }}
        ignoreDiacritics
      />
    </TabContainer>
  );
};

const enumColumn = <T extends string>(
  list: readonly T[],
  labels: Record<T, string>,
  { orderByIndex }: { orderByIndex?: boolean } = {}
) =>
  ({
    type: 'singleSelect',
    filterOperators: getGridSingleSelectOperators().filter(
      (op) => op.value !== 'not'
    ),
    valueOptions: list.map((v) => ({
      value: v,
      label: labels[v],
    })),
    valueFormatter: (value: T) => labels[value],
    ...(orderByIndex ? { sortComparator: cmpBy((v) => list.indexOf(v)) } : {}),
  } satisfies Partial<GridColDef<any, T, string>>);

const columns: Array<GridColDef<ProjectGridItemFragment>> = [
  {
    headerName: 'Project Name',
    field: 'name',
    minWidth: 300,
    valueGetter: (_, { name }) => name.value,
    renderCell: ({ value, row }) => (
      <Link to={`/projects/${row.id}`}>{value}</Link>
    ),
  },
  {
    headerName: 'Country',
    field: 'primaryLocation.country',
    minWidth: 300,
    valueGetter: (_, { primaryLocation }) => primaryLocation.value?.name.value,
  },
  {
    headerName: 'Project Step',
    field: 'project.step',
    width: 250,
    valueGetter: (_, row) => row.step.value,
    ...enumColumn(ProjectStepList, ProjectStepLabels, {
      orderByIndex: true,
    }),
  },
  {
    headerName: 'Type',
    field: 'type',
    width: 130,
    valueGetter: labelFrom(ProjectTypeLabels),
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 160,
    valueGetter: labelFrom(ProjectStatusLabels),
  },
  {
    headerName: 'Engagements',
    field: 'engagements',
    width: 130,
    valueGetter: (_, { engagements }) => engagements.total,
  },
  {
    headerName: 'Sensitivity',
    field: 'sensitivity',
    width: 180,
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
