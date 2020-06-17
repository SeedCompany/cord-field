import { TextField, TextFieldProps } from '@material-ui/core';
import { identity } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useRifm } from 'rifm';
import { Except } from 'type-fest';
import { useFieldName } from './FieldGroup';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError, useFocusOnEnabled } from './util';

export type FormattedTextFieldProps<FieldValue = string> = Except<
  FieldConfig<FieldValue>,
  'formatOnBlur' | 'multiple'
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
  format,
  parse,
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

  const [managedVal, setManagedVal] = useState<{
    raw: string;
    parsed?: FieldValue;
  }>({
    raw: format ? format(input.value, name) : input.value,
    parsed: input.value,
  });
  const updateManagedVal = useCallback(() => {
    setManagedVal({
      raw: format ? format(input.value, name) : input.value,
      parsed: input.value,
    });
  }, [setManagedVal, format, name, input.value]);
  useEffect(() => {
    let newVal: any = input.value;
    // FF converts undefined to "" to try to keep the input controlled
    if (newVal === '' && managedVal.parsed === undefined) {
      newVal = undefined;
    }

    if (newVal !== managedVal.parsed) {
      updateManagedVal();
    }
  }, [updateManagedVal, input.value, managedVal.parsed]);

  const rifm = useRifm({
    value: managedVal.raw,
    onChange: (val) => {
      const parsed = parse
        ? parse(val, name)
        : // assume FieldValue is string if no parser given
          (val as any);
      setManagedVal({ raw: val, parsed });
      input.onChange(parsed);
    },
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
      onBlur={(e) => {
        updateManagedVal();
        input.onBlur(e);
      }}
      variant={variant}
      inputRef={ref}
      helperText={getHelperText(meta, helperText)}
      error={showError(meta)}
    />
  );
}
