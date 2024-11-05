import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { GridInitialStatePro } from '@mui/x-data-grid-pro/models/gridStatePro';
import { useDebounceFn } from 'ahooks';
import { isEqual, merge } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
import { TabPanelContent } from '~/components/Tabs';
import { useSessionStorage } from '~/hooks/useSessionStorage';
import { PartnerDetailEngagementsDocument } from './PartnerDetailEngagements.graphql';

export const PartnerDetailEngagements = () => {
  const { partnerId = '' } = useParams();
  const [savedGridState, setSavedGridState] =
    useSessionStorage<GridInitialStatePro>(
      `partners-engagements-grid-state-${partnerId}`,
      EngagementInitialState
    );
  const prevState = useRef<GridInitialStatePro | null>(null);

  const [props] = useDataGridSource({
    query: PartnerDetailEngagementsDocument,
    variables: { id: partnerId },
    listAt: 'partner.engagements',
    initialInput: {
      sort: EngagementColumns[0]!.field,
    },
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, props.slots, {
        toolbar: EngagementToolbar,
      } satisfies DataGridProps['slots']),
    [props.slots]
  );
  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, props.slotProps),
    [props.slotProps]
  );

  const onStateChange = useDebounceFn(
    () => {
      const gridState = props.apiRef.current.exportState();
      if (!isEqual(gridState, prevState.current)) {
        prevState.current = gridState;
        setSavedGridState(gridState);
      }
    },
    { wait: 500, maxWait: 500 }
  );

  useEffect(() => {
    props.apiRef.current.restoreState(savedGridState);
  }, [savedGridState, props.apiRef]);

  return (
    <TabPanelContent>
      <DataGrid<Engagement>
        {...DefaultDataGridStyles}
        {...props}
        slots={slots}
        slotProps={slotProps}
        columns={EngagementColumns}
        initialState={EngagementInitialState}
        headerFilters
        hideFooter
        onStateChange={onStateChange.run}
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};
