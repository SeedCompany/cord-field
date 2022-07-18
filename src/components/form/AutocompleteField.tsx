import {
  Chip,
  ChipProps,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import { Autocomplete, AutocompleteProps, Value } from '@material-ui/lab';
import { identity } from 'lodash';
import React, { useCallback, useLayoutEffect } from 'react';
import { Except } from 'type-fest';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

export type AutocompleteFieldProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Except<FieldConfig<T, Multiple>, 'allowNull' | 'parse' | 'format'> &
  Pick<
    TextFieldProps,
    'helperText' | 'label' | 'required' | 'autoFocus' | 'variant' | 'margin'
  > & {
    ChipProps?: ChipProps;
    options: readonly T[];
    // Allowed but ignored from useAutocompleteQuery
    root?: unknown;
  } & Except<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    | 'value'
    | 'onChange'
    | 'defaultValue'
    | 'renderInput'
    | 'renderTags'
    | 'filterSelectedOptions'
    | 'ChipProps'
    | 'options'
  >;

/**
 * This is useful as a select combo field for single or multiple values.
 */
export function AutocompleteField<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  multiple,
  defaultValue,
  ChipProps,
  autoFocus,
  helperText,
  label,
  placeholder,
  variant,
  required,
  compareBy,
  options,
  margin,
  root: _,
  ...props
}: AutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
  type Val = Value<T, Multiple, DisableClearable, FreeSolo>;

  const selectOnFocus = props.selectOnFocus ?? !props.freeSolo;
  const andSelectOnFocus = useCallback(
    (el) => selectOnFocus && el.select(),
    [selectOnFocus]
  );

  const {
    input: field,
    meta,
    ref,
    rest: autocompleteProps,
  } = useField({
    ...props,
    multiple,
    required,
    allowNull: !multiple,
    defaultValue,
    compareBy,
    autoFocus,
    onFocus: andSelectOnFocus,
  });

  const getOptionLabel = props.getOptionLabel ?? identity;

  const selectedText =
    multiple || !(field.value as T | '')
      ? ''
      : getOptionLabel(field.value as T);
  useLayoutEffect(() => {
    props.onInputChange?.(
      // @ts-expect-error yeah we are faking the event. yell at me when it's a problem
      {},
      selectedText,
      'reset'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onInputChange, selectedText]);

  return (
    <Autocomplete<T, Multiple, typeof required, FreeSolo>
      disableClearable={required}
      disableCloseOnSelect={multiple}
      loadingText={<CircularProgress size={16} />}
      {...autocompleteProps}
      options={options as T[]}
      disabled={meta.disabled}
      // FF also has multiple and defaultValue
      multiple={multiple}
      renderTags={(values: T[], getTagProps) =>
        values.map((option: T, index: number) => (
          <Chip
            variant="outlined"
            {...ChipProps}
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
            key={index}
          />
        ))
      }
      // FF for some reason doesn't handle defaultValue correctly
      value={((field.value as Val | null) || meta.defaultValue) as Val}
      onBlur={field.onBlur}
      onFocus={field.onFocus}
      onChange={(_, value) => {
        field.onChange(value);
      }}
      onKeyDown={(event) => {
        // Prevent submitting form while searching, user is probably trying
        // to execute search (which happens automatically).
        if (event.key === 'Enter' && props.loading) event.preventDefault();
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          // no asterisk
          InputLabelProps={{ ...params.InputLabelProps, required: false }}
          label={label}
          placeholder={placeholder}
          helperText={getHelperText(meta, helperText)}
          required={required}
          inputRef={ref}
          error={showError(meta)}
          autoFocus={autoFocus}
          focused={meta.focused}
          variant={variant}
          margin={margin}
        />
      )}
      getOptionSelected={
        compareBy ? (a, b) => compareBy(a) === compareBy(b) : undefined
      }
    />
  );
}
