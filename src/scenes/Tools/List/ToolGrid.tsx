import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import {
  ToolDataGridRowFragment as Tool,
  ToolColumns,
  ToolInitialState,
  ToolToolbar,
} from '~/components/ToolDataGrid';
import { ToolsDocument } from './tools.graphql';

export const ToolGrid = () => {
  const [dataGridProps] = useDataGridSource({
    query: ToolsDocument,
    variables: { input: {} },
    listAt: 'tools',
    initialInput: {
      sort: ToolColumns[0]!.field,
    },
  });

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: ToolToolbar },
  });

  return (
    <DataGrid<Tool>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={ToolColumns}
      initialState={ToolInitialState}
      headerFilters
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
