import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import { FC, ReactNode } from 'react';
import * as React from 'react';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

const useStyles = makeStyles(({ typography }) => ({
  fieldLabel: {
    fontWeight: typography.weight.bold,
  },
}));

export type SelectFieldProps<T = string> = FieldConfig<T> & {
  name: string;
  selectOptions: SelectItem[];
  helperText?: ReactNode;
  label?: string;
} & FormControlProps;

interface SelectItem {
  value: any;
  label: string;
}

export const SelectField: FC<SelectFieldProps> = ({
  label,
  selectOptions,
  helperText,
  ...props
}) => {
  const classes = useStyles();
  const { input, meta, rest } = useField(props);

  return (
    <FormControl
      disabled={meta.disabled}
      focused={meta.focused}
      error={showError(meta)}
      {...rest}
    >
      {label && <FormLabel className={classes.fieldLabel}>{label}</FormLabel>}
      <Select
        autoFocus={rest.autoFocus}
        {...input}
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
