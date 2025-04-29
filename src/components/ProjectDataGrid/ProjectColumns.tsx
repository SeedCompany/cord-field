import {
  DataGridProProps as DataGridProps,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import {
  ProjectStatusLabels,
  ProjectStatusList,
  ProjectStepLabels,
  ProjectStepList,
  ProjectTypeLabels,
  ProjectTypeList,
} from '~/api/schema.graphql';
import {
  booleanColumn,
  dateColumn,
  enumColumn,
  getInitialVisibility,
  QuickFilterButton,
  QuickFilterResetButton,
  QuickFilters,
  textColumn,
  Toolbar,
  useEnumListFilterToggle,
  useFilterToggle,
} from '../Grid';
import { ProjectNameColumn } from '../Grid/Columns/ProjectNameColumn';
import { SensitivityColumn } from '../Grid/Columns/SensitivityColumn';
import { ProjectDataGridRowFragment as Project } from './projectDataGridRow.graphql';

export const ProjectColumns: Array<GridColDef<Project>> = [
  ProjectNameColumn({
    field: 'name',
    headerName: 'Name',
    valueGetter: (_, project) => project,
    width: 300,
  }),
  {
    field: 'primaryLocation.name',
    ...textColumn(),
    valueGetter: (_, { primaryLocation }) => primaryLocation.value?.name.value,
    headerName: 'Country',
    width: 300,
  },
  {
    field: 'step',
    ...enumColumn(ProjectStepList, ProjectStepLabels, {
      orderByIndex: true,
    }),
    valueGetter: (_, row) => row.step.value,
    headerName: 'Step',
    width: 250,
  },
  {
    field: 'type',
    ...enumColumn(ProjectTypeList, ProjectTypeLabels),
    headerName: 'Type',
    width: 130,
  },
  {
    field: 'status',
    ...enumColumn(ProjectStatusList, ProjectStatusLabels, {
      orderByIndex: true,
    }),
    headerName: 'Status',
    width: 160,
  },
  {
    field: 'engagements',
    type: 'number',
    valueGetter: (_, { engagements }) => engagements.total,
    filterable: false,
    headerName: 'Engagements',
    width: 130,
  },
  {
    headerName: 'MOU Start',
    field: 'mouStart',
    ...dateColumn(),
  },
  {
    headerName: 'MOU End',
    field: 'mouEnd',
    ...dateColumn(),
  },
  SensitivityColumn({}),
  {
    field: 'isMember',
    ...booleanColumn(),
    headerName: 'Member',
  },
  {
    field: 'pinned',
    ...booleanColumn(),
    headerName: 'Pinned',
  },
];

export const ProjectInitialState = {
  pinnedColumns: {
    left: ProjectColumns.slice(0, 1).map((column) => column.field),
  },
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(ProjectColumns),
      isMember: false,
      pinned: false,
    },
  },
} satisfies DataGridProps['initialState'];

export const ProjectToolbar = () => (
  <Toolbar sx={{ justifyContent: 'flex-start', gap: 2 }}>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <QuickFilters sx={{ flex: 1 }}>
      <QuickFilterResetButton />
      <QuickFilterButton {...useFilterToggle('isMember')}>
        Mine
      </QuickFilterButton>
      <QuickFilterButton {...useFilterToggle('pinned')}>
        Pinned
      </QuickFilterButton>
      <QuickFilterButton {...useEnumListFilterToggle('status', 'Active')}>
        Active
      </QuickFilterButton>
      <QuickFilterButton
        {...useEnumListFilterToggle('status', 'InDevelopment')}
      >
        In Development
      </QuickFilterButton>
    </QuickFilters>
  </Toolbar>
);
