import { GridColDef } from '@mui/x-data-grid-pro';
import { ProjectStepLabels, ProjectStepList } from '~/api/schema.graphql';
import { EngagementDataGridRowFragment } from '../../EngagementDataGrid';
import { enumColumn, textColumn } from '../../Grid';
import { Link } from '../../Routing';

export const MOUStartColumns: Array<GridColDef<EngagementDataGridRowFragment>> =
  [
    {
      headerName: 'Project',
      field: 'project.name',
      ...textColumn(),
      width: 200,
      flex: 1,
      valueGetter: (_, row) => row.project.name.value,
      renderCell: ({ value, row }) => (
        <Link to={`/projects/${row.project.id}`}>{value}</Link>
      ),
      hideable: false,
    },
    {
      headerName: 'Project Step',
      field: 'project.step',
      ...enumColumn(ProjectStepList, ProjectStepLabels, {
        orderByIndex: true,
      }),
      width: 350,
      valueGetter: (_, row) => row.project.step.value,
    },
    {
      headerName: 'MOU Start',
      field: 'startDate',
      type: 'date',
      valueGetter: (_, { startDate }) => startDate.value?.toJSDate(),
      filterable: false,
    },
  ];
