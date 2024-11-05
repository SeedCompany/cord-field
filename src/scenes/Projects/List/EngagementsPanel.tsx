import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { GridInitialStatePro } from '@mui/x-data-grid-pro/models/gridStatePro';
import { useDebounceFn } from 'ahooks';
import { isEqual, merge } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
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
import { useSessionStorage } from '~/hooks/useSessionStorage';
import { EngagementListDocument } from './EngagementList.graphql';

export const EngagementsPanel = () => {
  const [savedGridState, setSavedGridState] =
    useSessionStorage<GridInitialStatePro>(
      'engagements-grid-state',
      EngagementInitialState
    );
  const prevState = useRef<GridInitialStatePro | null>(null);

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

  const onStateChange = useDebounceFn(
    () => {
      const gridState = dataGridProps.apiRef.current.exportState();
      if (!isEqual(gridState, prevState.current)) {
        prevState.current = gridState;
        setSavedGridState(gridState);
      }
    },
    { wait: 500, maxWait: 500 }
  );

  useEffect(() => {
    dataGridProps.apiRef.current.restoreState(savedGridState);
  }, [savedGridState, dataGridProps.apiRef]);

  return (
    <DataGrid<Engagement>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={EngagementColumns}
      initialState={savedGridState}
      headerFilters
      hideFooter
      onStateChange={onStateChange.run}
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
