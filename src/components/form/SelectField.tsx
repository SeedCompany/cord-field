import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import { FC, ReactNode } from 'react';
import * as React from 'react';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

export type SelectFieldProps<T = string> = FieldConfig<T> & {
  name: string;
  selectOptions: readonly SelectItem[];
  helperText?: ReactNode;
  label?: ReactNode;
} & FormControlProps;

interface SelectItem {
  value: any;
  label: ReactNode;
}

export const SelectField: FC<SelectFieldProps> = ({
  label,
  selectOptions,
  helperText,
  ...props
}) => {
  const { input, meta, rest } = useField(props);

  return (
    <FormControl
      disabled={meta.disabled}
      focused={meta.focused}
      error={showError(meta)}
      {...rest}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        autoFocus={rest.autoFocus}
        {...input}
        label={label}
        onChange={(e) => input.onChange(e.target.value)}
      >
        {selectOptions.map(({ value, label }: SelectItem) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
    </FormControl>
  );
};
