import {
  DataGridProProps as DataGridProps,
  GridRowId,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { entries } from '@seedcompany/common';
import { useState } from 'react';
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
  ExpansionMarker,
  ProgressReportsColumnMap,
  ProgressReportsGrid,
} from './ProgressReportsGrid';

const COLLAPSED_ROW_HEIGHT = 54;

const columns = entries(ProgressReportsColumnMap).map(([name, col]) => ({
  field: name,
  ...col,
}));

const initialState = {
  pinnedColumns: {
    left: columns.slice(0, 2).map((column) => column.field),
  },
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(columns),
      'engagement.project.isMember': false,
      'engagement.project.pinned': false,
    },
  },
} satisfies DataGridProps['initialState'];

const ProgressReportsToolbar = () => (
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
  toolbar: ProgressReportsToolbar,
} satisfies DataGridProps['slots'];

export const ProgressReportsExpandedGrid = (props: Partial<DataGridProps>) => {
  const apiRef = useGridApiRef();

  const [selected, setSelected] = useState<GridRowId[]>([]);

  return (
    <ProgressReportsGrid
      {...props}
      density="standard"
      slots={slots}
      apiRef={apiRef}
      columns={columns}
      initialState={initialState}
      onRowClick={({ id }) => setSelected(selected.length > 0 ? [] : [id])}
      rowSelectionModel={selected}
      getRowHeight={(params) =>
        apiRef.current.isRowSelected(params.id) ? 'auto' : COLLAPSED_ROW_HEIGHT
      }
      sx={[
        {
          // Don't want 'auto' to shrink below this when the cell is empty
          '.MuiDataGrid-cell': {
            minHeight: COLLAPSED_ROW_HEIGHT,
          },
          [`.MuiDataGrid-row--dynamicHeight .MuiDataGrid-cell:not(.${ExpansionMarker})`]:
            {
              // Magic number to keep text vertically unchanged when the row is expanded
              pt: '17.5px',
            },
        },
        ...extendSx(props.sx),
      ]}
    />
  );
};
