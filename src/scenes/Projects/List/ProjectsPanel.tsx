import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { GridInitialStatePro } from '@mui/x-data-grid-pro/models/gridStatePro';
import { useDebounceFn } from 'ahooks';
import { isEqual, merge } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { useSessionStorage } from '~/hooks/useSessionStorage';
import { ProjectListDocument } from './ProjectList.graphql';

export const ProjectsPanel = () => {
  const [savedGridState, setSavedGridState] =
    useSessionStorage<GridInitialStatePro>(
      'projects-grid-state',
      ProjectInitialState
    );
  const prevState = useRef<GridInitialStatePro | null>(null);

  const [dataGridProps] = useDataGridSource({
    query: ProjectListDocument,
    variables: {},
    listAt: 'projects',
    initialInput: {
      sort: 'name',
    },
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, {
        toolbar: ProjectToolbar,
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
    <DataGrid<Project>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={ProjectColumns}
      initialState={savedGridState}
      headerFilters
      hideFooter
      onStateChange={onStateChange.run}
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
