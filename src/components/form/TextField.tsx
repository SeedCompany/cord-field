import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core';
import * as React from 'react';
import { Except } from 'type-fest';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError, useFocusOnEnabled } from './util';

export type TextFieldProps<FieldValue = string> = FieldConfig<FieldValue> & {
  name: string;
} & Except<
    MuiTextFieldProps,
    'defaultValue' | 'error' | 'value' | 'name' | 'inputRef'
  >;

/** Combines final form field and MUI text field */
export function TextField<FieldValue = string>({
  name,
  InputProps,
  helperText,
  disabled: disabledProp,
  children,
  ...props
}: TextFieldProps<FieldValue>) {
  const { input, meta, rest } = useField(name, props);
  const disabled = disabledProp ?? meta.submitting;
  const ref = useFocusOnEnabled(meta, disabled);

  return (
    <MuiTextField
      name={name}
      disabled={disabled}
      required={props.required}
      {...rest}
      inputRef={ref}
      InputProps={{ ...InputProps, ...input }}
      helperText={getHelperText(meta, helperText)}
      error={showError(meta)}
    >
      {children}
    </MuiTextField>
  );
}
