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
} from '~/components/EngagementDataGrid';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import { EngagementListDocument } from './EngagementList.graphql';
import { PanelProps } from './ProjectsPanel';

export const EngagementsPanel = ({ filters }: PanelProps) => {
  const [dataGridProps] = useDataGridSource({
    query: EngagementListDocument,
    variables: {
      input: {
        filter: {
          ...(filters.mine ? { project: { mine: true } } : {}),
          ...(filters.pinned ? { project: { pinned: true } } : {}),
        },
      },
    },
    listAt: 'engagements',
    initialInput: {},
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

  return (
    <DataGrid<Engagement>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={EngagementColumns}
      initialState={EngagementInitialState}
      headerFilters
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
