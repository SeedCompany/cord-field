import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import React, { ReactNode } from 'react';
import { useFormState } from 'react-final-form';
import { useFieldName } from './FieldGroup';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

export type RadioFieldProps<T = string> = FieldConfig<T> & {
  name: string;
  label?: string;
  helperText?: ReactNode;
} & Omit<FormControlProps, 'required'>;

interface RadioOptionProps<T = string>
  extends Pick<FormControlLabelProps, 'label' | 'labelPlacement' | 'disabled'> {
  value: T;
}

export const RadioOption = <FieldValue extends any = string>({
  label,
  value,
  disabled: disabledProp,
  ...props
}: RadioOptionProps<FieldValue>) => {
  const { submitting } = useFormState({
    subscription: { submitting: true },
  });
  const disabled = disabledProp ?? submitting;

  return (
    <FormControlLabel
      {...props}
      label={label}
      disabled={disabled}
      control={<Radio value={value} />}
    />
  );
};

export const RadioField = <FieldValue extends any = string>({
  children,
  name: nameProp,
  label,
  helperText,
  ...props
}: RadioFieldProps<FieldValue>) => {
  const name = useFieldName(nameProp);
  const { input, meta, rest } = useField(name, {
    type: 'radio',
    required: true,
    ...props,
  });
  return (
    <FormControl
      {...rest}
      component="fieldset"
      error={showError(meta)}
      required
      disabled={props.disabled ?? meta.submitting}
    >
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <RadioGroup {...input}>{children}</RadioGroup>
      <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
    </FormControl>
  );
};
