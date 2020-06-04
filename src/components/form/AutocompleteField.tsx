import { TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteProps, Value } from '@material-ui/lab';
import * as React from 'react';
import { Except } from 'type-fest';
import { useFieldName } from './FieldGroup';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError, useFocusOnEnabled } from './util';

export type AutocompleteFieldProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Except<
  FieldConfig<Value<T, Multiple, DisableClearable, FreeSolo>>,
  'multiple'
> & {
  name: string;
} & Except<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    'value' | 'onChange' | 'renderInput'
  > &
  Pick<TextFieldProps, 'helperText' | 'label'>;

export function AutocompleteField<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  name: nameProp,
  helperText,
  disabled: disabledProp,
  label,
  ...props
}: AutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
  const name = useFieldName(nameProp);
  const { input, meta, rest } = useField(name, props);
  const disabled = disabledProp ?? meta.submitting;
  const ref = useFocusOnEnabled(meta, disabled);
  return (
    <Autocomplete<T, Multiple, DisableClearable, FreeSolo>
      disabled={disabled}
      // FF also has multiple so need to pull it from props.
      // There's weirdness with this generic value too so casting.
      // This is ok here because its just a boolean at runtime and
      // the usefulness of the generic is already applied at our props level.
      multiple={props.multiple as any}
      {...rest}
      {...input}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          inputRef={ref}
          required={props.required}
          helperText={getHelperText(meta, helperText)}
          error={showError(meta)}
        />
      )}
    />
  );
}
