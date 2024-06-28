import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import {
  EngagementDataGridRowFragment as Engagement,
  EngagementColumns,
} from '~/components/EngagementDataGrid';
import {
  DefaultDataGridStyles,
  flexLayout,
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
    () => merge({}, DefaultDataGridStyles.slots, dataGridProps.slots),
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
      initialState={engagementInitialState}
      headerFilters
      sx={[flexLayout, noHeaderFilterButtons]}
    />
  );
};

const engagementInitialState = {
  pinnedColumns: {
    left: [EngagementColumns[0]!.field],
  },
} satisfies DataGridProps['initialState'];
