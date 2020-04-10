import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core';
import * as React from 'react';
import { Except } from 'type-fest';
import { FieldConfig, useField } from './index';

export type TextFieldProps<FieldValue = string> = FieldConfig<FieldValue> & {
  name: string;
} & Except<MuiTextFieldProps, 'defaultValue' | 'error' | 'value' | 'name'>;

/** Combines final form field and MUI text field */
export function TextField<FieldValue = string>({
  name,
  InputProps,
  helperText: nonErrorHelperText,
  children,
  ...props
}: TextFieldProps<FieldValue>) {
  const { input, meta, rest } = useField(name, props);

  const helperText = meta.showError
    ? meta.error || meta.submitError
    : nonErrorHelperText;

  return (
    <MuiTextField
      name={name}
      disabled={meta.submitting}
      required={props.required}
      {...rest}
      InputProps={{ ...InputProps, ...input }}
      // always pass a truthy value, aka ' ', so layout doesn't adjust
      // when an error is shown. This is per Material Design.
      helperText={helperText || ' '}
      error={meta.showError}
    >
      {children}
    </MuiTextField>
  );
}
