import { Box, FormControl, TextFieldProps } from '@mui/material';
import {
  DataGridProProps as DataGridProps,
  GRID_DEFAULT_LOCALE_TEXT,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { mapEntries } from '@seedcompany/common';
import { Sx } from '../../common';
import { isCellEditable } from './isCellEditable';

GRID_DEFAULT_LOCALE_TEXT.filterPanelOperator = 'Condition';

const scrollIntoView: DataGridProps['onMenuOpen'] = ({ target }) => {
  target?.closest('.MuiDataGrid-root')?.scrollIntoView({ block: 'center' });
};

const MyFormControl = (props: any) => (
  <FormControl
    // Revert our theme defaults adding margins to selects
    margin="none"
    {...props}
  />
);

const inputProps = {
  variant: 'outlined',
  size: 'small',
} as const;

const InputComponentProps = {
  ...inputProps,
  // Revert our theme defaults adding margins to text fields
  margin: 'none',
} satisfies TextFieldProps;

export const DefaultDataGridStyles = {
  density: 'compact',
  headerFilterHeight: 90,
  ignoreDiacritics: true,
  slots: {
    baseFormControl: MyFormControl,
  },
  slotProps: {
    columnsManagement: {
      getTogglableColumns: (columns) =>
        columns
          .filter((column) => !column.hidden)
          .map((column) => column.field),
    },
    filterPanel: {
      filterFormProps: {
        valueInputProps: {
          InputComponentProps,
        },
        columnInputProps: inputProps,
        logicOperatorInputProps: inputProps,
        operatorInputProps: {
          ...inputProps,
          sx: { mx: '5px' },
        },
      },
    },
    baseSelect: {
      displayEmpty: true,
    },
    baseTextField: {
      InputLabelProps: {
        shrink: true,
      },
    },
    headerFilterCell: {
      InputComponentProps: {
        ...InputComponentProps,
        placeholder: 'Value',
      },
    },
  },
  onMenuOpen: scrollIntoView,
  isCellEditable,
} satisfies Partial<DataGridProps>;

export const EmptyEnumFilterValue = (
  <Box
    sx={{
      '.MuiSelect-select &': {
        color: 'text.disabled',
      },
      '.MuiMenuItem-root &': {
        fontStyle: 'italic',
      },
    }}
  >
    Any
  </Box>
) as unknown as string; // Because getOptionLabel wants a string returned even though it is fine with elements.

// The DataGrid has flex dimensions
export const flexLayout = {
  // Avoid no intrinsic dimensions warning.
  minWidth: '1px',
  minHeight: '1px',

  // MUI-X filler is flaky with flex layouts.
  // It sometimes causes pinned rows to not show, based on some JS calc race condition.
  // This block works around that, by avoiding their JS calc layout
  // values, and just using CSS.
  ...{
    // Change the filler to just spread to the entire area of the rows.
    // This avoids the JS calculation MUI-X does to try to position
    // the filler in the remaining space below the rows in order to fill
    // the intrinsic dimensions.
    '.MuiDataGrid-filler': {
      position: 'absolute',
      top: 0,
      height: '100% !important',
    },
    // Because the filler is below the rows in the DOM, we now have to
    // bump the z index of the rows, so they show above the filler.
    '.MuiDataGrid-virtualScrollerRenderZone': {
      zIndex: 1,
    },
    // The MUI filler also accounts for bottom horizontal scrollbar height.
    // Since our change above pulls the filler out of the layout (position: absolute),
    // we need to account for that space ourselves.
    '.MuiDataGrid-virtualScrollerContent': {
      marginBottom:
        'calc(var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
    },
    // Since the fillers' top border is now hidden behind rows,
    // we need to recreate the bottom border of the last row.
    // Only if the filler is present, which MUI-X removes when not needed,
    // to avoid the border doubling up with the footer top border.
    '.MuiDataGrid-virtualScrollerContent:has(~.MuiDataGrid-filler) .MuiDataGrid-row--lastVisible .MuiDataGrid-cell':
      {
        borderBottom: '1px solid var(--rowBorderColor)',
      },
  },
} satisfies Sx;

// Hide the filter operator button - not useful when there is only one operator
export const noHeaderFilterButtons = {
  '.MuiDataGrid-headerFilterRow .MuiDataGrid-columnHeader': {
    [[
      // Hide the operator button
      `button[title="${GRID_DEFAULT_LOCALE_TEXT.filterPanelOperator}"]`,
      // Hide the clear icon button for select inputs
      // It seems cluttered, and it is only a couple clicks to clear it.
      '.MuiFormControl-root:has(.MuiSelect-select) + button:has([data-testid="ClearIcon"])',
    ].join()]: {
      display: 'none',
    },
  },
} satisfies Sx;

export const noFooter = {
  '.MuiDataGrid-main': {
    borderBottomLeftRadius: 'inherit',
    borderBottomRightRadius: 'inherit',
  },
} satisfies Sx;

export const getInitialVisibility = (columns: GridColDef[]) =>
  mapEntries(columns, (column) => [column.field, !column.hidden]).asRecord;

declare module '@mui/x-data-grid/internals' {
  interface GridBaseColDef {
    hidden?: boolean;
  }
}
