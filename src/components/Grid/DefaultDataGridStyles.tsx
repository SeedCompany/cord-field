import { Box, FormControl, TextFieldProps } from '@mui/material';
import type { DataGridProProps as DataGridProps } from '@mui/x-data-grid-pro';
import { Sx } from '../../common';

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

// Hide filter operator button - useful when there is only one operator
export const noHeaderFilterButtons = {
  '.MuiDataGrid-headerFilterRow .MuiDataGrid-columnHeader button': {
    display: 'none',
  },
} satisfies Sx;
