import {
  DataGridProProps as DataGridProps,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useMemo } from 'react';
import { extendSx } from '~/common';
import {
  getInitialVisibility,
  QuickFilterButton,
  QuickFilterResetButton,
  QuickFilters,
  Toolbar,
  useFilterToggle,
} from '~/components/Grid';
import {
  ExpansionContext,
  useExpandedSetup,
} from '../../../components/Widgets/expansionState';
import {
  PnpErrorsColumnMap,
  PnpErrorsGrid,
  PnpErrorsGridProps,
} from './PnpErrorsGrid';

const columns = Object.values(PnpErrorsColumnMap);

const initialState = {
  pinnedColumns: {
    left: columns.slice(0, 3).map((column) => column.field),
  },
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(columns),
      'engagement.project.isMember': false,
      'engagement.project.pinned': false,
    },
  },
} satisfies DataGridProps['initialState'];

const PnpErrorsToolbar = () => (
  <Toolbar
    sx={{
      px: 2,
      justifyContent: 'flex-start',
      gap: 2,
      backgroundColor: 'inherit',
    }}
  >
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <QuickFilters sx={{ flex: 1 }}>
      <QuickFilterResetButton />
      <QuickFilterButton {...useFilterToggle('engagement.project.isMember')}>
        Mine
      </QuickFilterButton>
      <QuickFilterButton {...useFilterToggle('engagement.project.pinned')}>
        Pinned
      </QuickFilterButton>
    </QuickFilters>
  </Toolbar>
);

const slots = {
  toolbar: PnpErrorsToolbar,
} satisfies DataGridProps['slots'];

export const PnpErrorsExpandedGrid = (
  props: Omit<PnpErrorsGridProps, 'columns'>
) => {
  const apiRef = useGridApiRef();

  const { expanded, onMouseDown } = useExpandedSetup();

  const slotProps = useMemo(
    (): DataGridProps['slotProps'] => ({
      row: {
        onMouseDown,
      },
    }),
    [onMouseDown]
  );

  return (
    <ExpansionContext.Provider value={expanded}>
      <PnpErrorsGrid
        {...props}
        density="standard"
        slots={slots}
        apiRef={apiRef}
        columns={columns}
        initialState={initialState}
        slotProps={slotProps}
        sx={[...extendSx(props.sx)]}
      />
    </ExpansionContext.Provider>
  );
};
