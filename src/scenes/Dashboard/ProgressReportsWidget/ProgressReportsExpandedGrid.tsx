import { Box } from '@mui/material';
import {
  DataGridProProps as DataGridProps,
  GridColDef,
  GridRenderCellParams,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { entries } from '@seedcompany/common';
import { merge } from 'lodash';
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
  CollapseAllButton,
  ExpandAllButton,
  ExpansionContext,
  useExpandedSetup,
} from './expansionState';
import {
  ExpansionMarker,
  ProgressReportsColumnMap,
  ProgressReportsGrid,
  ProgressReportsGridProps,
  useProgressReportsDataGrid,
} from './ProgressReportsGrid';

const COLLAPSED_ROW_HEIGHT = 54;

const wrapForNonExpansion = (renderCell?: GridColDef['renderCell']) => {
  // Position cell text consistently regardless of expansion
  const NonExpansionCell = (props: GridRenderCellParams) => (
    <Box
      sx={{
        // Causes row to grow by 1px on row height auto
        // Shift the 1px to padding to prevent.
        height: COLLAPSED_ROW_HEIGHT - 1,
        pt: '1px',
        // Text shifts by a pixel without this - any value works
        lineHeight: 1,

        display: 'flex',
        alignItems: 'center',
        '.MuiDataGrid-cell--textCenter &': {
          justifyContent: 'center',
        },
      }}
    >
      {renderCell ? renderCell(props) : props.formattedValue ?? props.value}
    </Box>
  );
  return NonExpansionCell;
};

const columns = entries(ProgressReportsColumnMap).map(([name, col]) => ({
  field: name,
  ...col,
  ...(!(
    'cellClassName' in col && col.cellClassName.includes(ExpansionMarker)
  ) && {
    renderCell: wrapForNonExpansion(
      'renderCell' in col ? col.renderCell : undefined
    ),
  }),
}));

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
    <CollapseAllButton />
    <ExpandAllButton />
  </Toolbar>
);

const slots = {
  toolbar: ProgressReportsToolbar,
} satisfies DataGridProps['slots'];

export const ProgressReportsExpandedGrid = (
  props: Omit<ProgressReportsGridProps, 'columns'>
) => {
  const apiRef = useGridApiRef();
  const { expanded, onMouseDown, onRowClick } = useExpandedSetup();

  const dataGridProps = useProgressReportsDataGrid({
    ...props,
    apiRef,
    columns,
  });

  const mouseSlotProps = useMemo(
    (): DataGridProps['slotProps'] => ({ row: { onMouseDown } }),
    [onMouseDown]
  );

  const slotProps = useMemo(
    () => merge({}, dataGridProps.slotProps, mouseSlotProps),
    [dataGridProps.slotProps, mouseSlotProps]
  );

  return (
    <ExpansionContext.Provider value={expanded}>
      <ProgressReportsGrid
        {...props}
        density="standard"
        slots={slots}
        apiRef={apiRef}
        columns={columns}
        initialState={initialState}
        slotProps={slotProps}
        onRowClick={onRowClick}
        getRowHeight={(params) =>
          expanded.has(params.id) ? 'auto' : COLLAPSED_ROW_HEIGHT
        }
        sx={[
          {
            // Don't want 'auto' to shrink below this when the cell is empty
            '.MuiDataGrid-cell': {
              minHeight: COLLAPSED_ROW_HEIGHT,
            },
          },
          ...extendSx(props.sx),
        ]}
      />
    </ExpansionContext.Provider>
  );
};
