import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
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

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, {
        toolbar: EngagementToolbar,
      } satisfies DataGridProps['slots']),
    [dataGridProps.slots]
  );

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

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
