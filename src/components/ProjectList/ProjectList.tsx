import { Box } from '@mui/material';
import {
  DataGridPro as DataGrid,
  DataGridProProps,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { cmpBy, simpleSwitch } from '@seedcompany/common';
import {
  ProjectStatusLabels,
  ProjectStepLabels,
  ProjectStepList,
  ProjectTypeLabels,
  Sensitivity,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import {
  DefaultDataGridStyles,
  enumColumn,
  flexLayout,
  noHeaderFilterButtons,
} from '../Grid';
import { Link } from '../Routing';
import { SensitivityIcon } from '../Sensitivity';
import { ProjectRowFragment } from './projectRow.graphql';

interface GridDetailsProps {
  isCacheComplete: boolean | undefined;
  total: number;
  list: readonly any[] | undefined;
}

interface ProjectListProps {
  tableProps: Partial<DataGridProProps & GridDetailsProps>;
  initialState?: DataGridProProps['initialState'];
}

export const ProjectList = (props: ProjectListProps) => {
  const { tableProps, initialState } = props;

  return (
    <DataGrid
      columns={columns}
      disableRowSelectionOnClick
      headerFilters
      initialState={initialState}
      sx={{
        ...flexLayout,
        ...noHeaderFilterButtons,
      }}
      {...DefaultDataGridStyles}
      {...tableProps}
    />
  );
};

const columns: Array<GridColDef<ProjectRowFragment>> = [
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
