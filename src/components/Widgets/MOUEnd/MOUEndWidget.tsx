import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import { ProjectStepLabels, ProjectStepList } from '~/api/schema.graphql';
import { EngagementListDocument } from '~/scenes/Projects/List/EngagementList.graphql';
import { EngagementDataGridRowFragment } from '../../EngagementDataGrid';
import { Form, SelectField } from '../../form';
import { enumColumn, textColumn } from '../../Grid';
import { Link } from '../../Routing';
import { WidgetConfig } from '../widgetConfig';

export const MOUEndColumns: Array<GridColDef<EngagementDataGridRowFragment>> = [
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

export const MOUEndWidgetConfig = {
  type: 'TableWidget',
  columns: MOUEndColumns,
  dataGridSourceConfig: {
    query: EngagementListDocument,
    variables: {},
    listAt: 'engagements',
    initialInput: {
      sort: MOUEndColumns[0]!.field,
    },
  },
  colSpan: 8,
  rowSpan: 6,
  key: 'table2',
  CardProps: { sx: { p: 0 } },
  to: '/projects',
  slots: {
    title: 'Projects Ending Soon',
    subTitle: 'Projects nearing completion in the next 30, 60, or 90 days',
    headerExtension: () => (
      <Box
        justifyContent="flex-end"
        marginRight={2}
        sx={{ height: 50, display: 'flex' }}
      >
        <Form onSubmit={() => null}>
          <SelectField
            label="Days"
            name="days"
            options={['30', '60', '90']}
            defaultValue="30"
            variant="outlined"
            size="small"
          />
        </Form>
      </Box>
    ),
  },
} satisfies WidgetConfig;
