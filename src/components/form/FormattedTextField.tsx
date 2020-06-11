import { TextField, TextFieldProps } from '@material-ui/core';
import { identity } from 'lodash';
import React from 'react';
import { useRifm } from 'rifm';
import { Except } from 'type-fest';
import { useFieldName } from './FieldGroup';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError, useFocusOnEnabled } from './util';

export type FormattedTextFieldProps<FieldValue = string> = FieldConfig<
  FieldValue
> & {
  name: string;
  /**
   * Format the user input.
   *
   * Default is `(value) => value`
   */
  formatInput?: (str: string) => string;
  /**
   * `formatInput` post-processor which allows you to fully replace any/all
   * symbol(s) preserving cursor
   */
  replace?: (str: string) => string;
  /**
   * `formatInput` post-processor called only if cursor is in
   * the last position and new symbols added.
   * Used for specific use-case to add non-accepted symbol when you type.
   */
  append?: (str: string) => string;
  /** Use replace input mode if true, use cursor visual hacks if prop provided */
  mask?: boolean;
  /** Regex to detect _accepted_ symbols */
  accept?: RegExp;
} & Except<
    TextFieldProps,
    'defaultValue' | 'error' | 'value' | 'name' | 'inputRef'
  >;

export function FormattedTextField<FieldValue = string>({
  formatInput,
  replace,
  append,
  mask,
  accept,
  name: nameProp,
  helperText,
  disabled: disabledProp,
  children,
  variant,
  ...props
}: FormattedTextFieldProps<FieldValue>) {
  const name = useFieldName(nameProp);
  const { input, meta, rest } = useField(name, props);
  const disabled = disabledProp ?? meta.submitting;
  const ref = useFocusOnEnabled(meta, disabled);

  const rifm = useRifm({
    value: input.value as any,
    onChange: input.onChange,
    format: formatInput ?? identity,
    append,
    accept: accept ?? /./g,
    mask,
    replace,
  });

  return (
    <TextField
      disabled={disabled}
      required={props.required}
      {...rest}
      {...input}
      {...rifm}
      variant={variant}
      inputRef={ref}
      helperText={getHelperText(meta, helperText)}
      error={showError(meta)}
    />
  );
}
