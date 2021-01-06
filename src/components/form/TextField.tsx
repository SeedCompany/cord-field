import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core';
import { useEffect } from 'react';
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

  // Call focus explicitly to fix inconsistent state when page loads
  // browser does the autofocus but the field doesn't look active
  useEffect(() => {
    if (props.autoFocus) {
      ref.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MuiTextField
      disabled={meta.disabled}
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
