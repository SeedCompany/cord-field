import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core';
import * as React from 'react';
import { Except } from 'type-fest';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

export type TextFieldProps<FieldValue = string> = FieldConfig<FieldValue> & {
  name: string;
} & Except<
    MuiTextFieldProps,
    'defaultValue' | 'error' | 'value' | 'name' | 'inputRef'
  >;

/** Combines final form field and MUI text field */
export function TextField<FieldValue = string>({
  InputProps,
  helperText,
  children,
  ...props
}: TextFieldProps<FieldValue>) {
  const { input, meta, ref, rest } = useField(props);

  return (
    <MuiTextField
      disabled={meta.disabled}
      focused={meta.focused}
      required={props.required}
      {...rest}
      name={input.name}
      inputRef={ref}
      InputProps={{ ...InputProps, ...input }}
      helperText={getHelperText(meta, helperText)}
      error={showError(meta)}
      // no asterisk
      InputLabelProps={{ ...props.InputLabelProps, required: false }}
    >
      {children}
    </MuiTextField>
  );
}
