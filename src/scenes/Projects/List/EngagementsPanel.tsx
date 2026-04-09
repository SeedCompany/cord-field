import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import {
  EngagementDataGridRowFragment as Engagement,
  EngagementColumns,
  EngagementInitialState,
  EngagementToolbar,
  useProcessEngagementUpdate,
} from '~/components/EngagementDataGrid';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import { EngagementListDocument } from './EngagementList.graphql';

export const EngagementsPanel = () => {
  const [dataGridProps] = useDataGridSource({
    query: EngagementListDocument,
    variables: {},
    listAt: 'engagements',
    initialInput: {
      sort: EngagementColumns[0]!.field,
    },
  });

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: EngagementToolbar },
  });

  const processEngagementUpdate = useProcessEngagementUpdate();

  return (
    <DataGrid<Engagement>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={EngagementColumns}
      initialState={EngagementInitialState}
      processRowUpdate={processEngagementUpdate}
      headerFilters
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
