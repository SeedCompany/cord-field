import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material';
import { identity } from 'lodash';
import { ReactNode } from 'react';
import { Except } from 'type-fest';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

export type SelectFieldProps<T, Multiple extends boolean | undefined> = Except<
  FieldConfig<T, Multiple>,
  'allowNull' | 'isEqual'
> & {
  options: readonly T[];
  getOptionLabel?: (option: T) => string;
  // This can be a label to show an empty option or a rendered EnumOption.
  defaultOption?: string | ReactNode;
  label?: ReactNode;
  helperText?: ReactNode;
} & Pick<
    FormControlProps,
    'color' | 'fullWidth' | 'margin' | 'size' | 'variant' | 'sx'
  > &
  Pick<SelectProps, 'displayEmpty'>;

export function SelectField<T, Multiple extends boolean | undefined>({
  // value handling
  options,
  getOptionLabel: getOptionLabelProp,
  defaultOption,
  multiple,

  // display labels
  label,
  helperText,

  // FormControl props
  color,
  fullWidth,
  margin,
  size,
  variant,

  ...props
}: SelectFieldProps<T, Multiple>) {
  const getOptionLabel = getOptionLabelProp ?? identity;

  const { input, meta, rest } = useField<T, Multiple>({
    ...props,
    multiple,
    allowNull: !multiple,
  });

  return (
    <FormControl
      disabled={meta.disabled}
      focused={meta.focused}
      error={showError(meta)}
      color={color}
      fullWidth={fullWidth}
      margin={margin}
      size={size}
      variant={variant}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        autoFocus={rest.autoFocus}
        {...input}
        // convert null to empty string so Select shows the label for it.
        // FF knows to convert empty string to null.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        value={input.value ?? meta.defaultValue ?? ''}
        label={label}
        onChange={(e) => input.onChange(e.target.value)}
        multiple={multiple}
        {...rest}
      >
        {defaultOption && (
          <MenuItem value="">
            {typeof defaultOption === 'string' ? (
              <em>{defaultOption}</em>
            ) : (
              defaultOption
            )}
          </MenuItem>
        )}
        {options.map((option, index) => (
          <MenuItem key={index} value={option as any}>
            {getOptionLabel(option)}
          </MenuItem>
        ))}
      </Select>
      {helperText !== false && (
        <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
      )}
    </FormControl>
  );
}
