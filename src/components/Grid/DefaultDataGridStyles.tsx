import { Box, FormControl, TextFieldProps } from '@mui/material';
import type { DataGridProProps as DataGridProps } from '@mui/x-data-grid-pro';

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
