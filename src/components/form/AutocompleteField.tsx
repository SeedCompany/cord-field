import { Chip, ChipProps, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteProps, Value } from '@material-ui/lab';
import { identity } from 'lodash';
import React, { useCallback } from 'react';
import { Except } from 'type-fest';
import { useFieldName } from './FieldGroup';
import { FieldConfig, useField } from './useField';
import {
  areListsEqual,
  compareNullable,
  getHelperText,
  showError,
  useFocusOnEnabled,
} from './util';

export type AutocompleteFieldProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Except<
  FieldConfig<Value<T, Multiple, DisableClearable, FreeSolo>>,
  'multiple' | 'allowNull' | 'parse' | 'format'
> &
  Pick<
    TextFieldProps,
    'helperText' | 'label' | 'required' | 'autoFocus' | 'variant'
  > & {
    name: string;
    getCompareBy?: (item: T) => any;
    ChipProps?: ChipProps;
    options: readonly T[];
  } & Except<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    | 'value'
    | 'onChange'
    | 'defaultValue'
    | 'renderInput'
    | 'renderTags'
    | 'loading'
    | 'filterSelectedOptions'
    | 'ChipProps'
    | 'options'
  >;

const emptyArray = [] as const;

/**
 * This is useful as a select combo field for single or multiple values.
 */
export function AutocompleteField<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  name: nameProp,
  multiple,
  defaultValue: defaultValueProp,
  disabled: disabledProp,
  ChipProps,
  autoFocus,
  helperText,
  label,
  variant,
  required,
  getCompareBy: getCompareByProp,
  options,
  ...props
}: AutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
  type Val = Value<T, Multiple, DisableClearable, FreeSolo>;

  const getCompareBy = getCompareByProp ?? identity;
  const defaultValue =
    defaultValueProp ?? ((multiple ? emptyArray : null) as Val);

  const name = useFieldName(nameProp);
  const { input: field, meta, rest: autocompleteProps } = useField<Val>(name, {
    ...props,
    required,
    allowNull: !multiple,
    defaultValue,
    isEqual: compareNullable((a, b) =>
      multiple
        ? areListsEqual(a.map(getCompareBy), b.map(getCompareBy))
        : getCompareBy(a) === getCompareBy(b)
    ),
    // Default to at least one item if required & multiple
    validate:
      !props.validate && required && multiple
        ? (val) =>
            Array.isArray(val) && val.length === 0 ? 'Required' : undefined
        : undefined,
  });
  const disabled = disabledProp ?? meta.submitting;

  const selectOnFocus = props.selectOnFocus ?? !props.freeSolo;
  const andSelectOnFocus = useCallback((el) => selectOnFocus && el.select(), [
    selectOnFocus,
  ]);
  const ref = useFocusOnEnabled<HTMLInputElement>(
    meta,
    disabled,
    andSelectOnFocus
  );

  const getOptionLabel = props.getOptionLabel ?? identity;

  return (
    <Autocomplete<T, Multiple, typeof required, FreeSolo>
      disableClearable={required}
      disableCloseOnSelect={multiple}
      {...autocompleteProps}
      options={options as T[]}
      disabled={disabled}
      // FF also has multiple and defaultValue
      multiple={multiple}
      renderTags={(values: T[], getTagProps) =>
        values.map((option: T, index: number) => (
          <Chip
            variant="outlined"
            {...ChipProps}
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
          />
        ))
      }
      // FF for some reason doesn't handle defaultValue correctly
      value={(field.value as Val | '') || defaultValue}
      onBlur={field.onBlur}
      onFocus={field.onFocus}
      onChange={(_, value) => {
        field.onChange(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          helperText={getHelperText(meta, helperText)}
          required={required}
          inputRef={ref}
          error={showError(meta)}
          autoFocus={autoFocus}
          variant={variant}
        />
      )}
      getOptionSelected={(a, b) => getCompareBy(a) === getCompareBy(b)}
    />
  );
}
