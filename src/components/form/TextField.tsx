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
} & Except<MuiTextFieldProps, 'defaultValue' | 'error' | 'value' | 'name'>;

/** Combines final form field and MUI text field */
export function TextField<FieldValue = string>({
  name,
  InputProps,
  helperText,
  children,
  ...props
}: TextFieldProps<FieldValue>) {
  const { input, meta, rest } = useField(name, props);

  return (
    <MuiTextField
      name={name}
      disabled={meta.submitting}
      required={props.required}
      {...rest}
      InputProps={{ ...InputProps, ...input }}
      helperText={getHelperText(meta, helperText)}
      error={showError(meta)}
    >
      {children}
    </MuiTextField>
  );
}
