import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import {
  ProjectStatusLabels,
  ProjectStatusList,
  ProjectStepLabels,
  ProjectStepList,
  ProjectTypeLabels,
  ProjectTypeList,
  SensitivityLabels,
  SensitivityList,
} from '~/api/schema.graphql';
import { enumColumn } from '../Grid';
import { Link } from '../Routing';
import { SensitivityIcon } from '../Sensitivity';
import { ProjectDataGridRowFragment as Project } from './projectDataGridRow.graphql';

export const SensitivityColumn = {
  field: 'sensitivity',
  ...enumColumn(SensitivityList, SensitivityLabels, {
    orderByIndex: true,
  }),
  headerName: 'Sensitivity',
  width: 110,
  renderCell: ({ value }) => (
    <Box display="flex" alignItems="center" gap={1} textTransform="uppercase">
      <SensitivityIcon value={value} disableTooltip />
      {value}
    </Box>
  ),
} satisfies GridColDef;

export const ProjectColumns: Array<GridColDef<Project>> = [
  {
    field: 'name',
    valueGetter: (_, { name }) => name.value,
    headerName: 'Name',
    minWidth: 300,
    renderCell: ({ value, row }) => (
      <Link to={`/projects/${row.id}`}>{value}</Link>
    ),
  },
  {
    field: 'primaryLocation.name',
    valueGetter: (_, { primaryLocation }) => primaryLocation.value?.name.value,
    headerName: 'Country',
    minWidth: 300,
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
    ...enumColumn(ProjectStatusList, ProjectStatusLabels),
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
  SensitivityColumn,
];
