import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import React, { createContext, ReactNode, useContext } from 'react';
import { useFieldName } from './FieldGroup';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

type LabelPlacement = FormControlLabelProps['labelPlacement'];

export type RadioFieldProps<T = string> = FieldConfig<T> & {
  name: string;
  label?: string;
  helperText?: ReactNode;
} & Omit<FormControlProps, 'required'> &
  Pick<FormControlLabelProps, 'labelPlacement'>;

interface RadioOptionProps<T = string>
  extends Pick<FormControlLabelProps, 'label' | 'labelPlacement' | 'disabled'> {
  value: T;
}

const useStyles = makeStyles(({ typography }) => ({
  fieldLabel: {
    fontWeight: typography.weight.bold,
  },
}));

export const RadioOption = <FieldValue extends any = string>({
  label,
  value,
  disabled: disabledProp,
  ...props
}: RadioOptionProps<FieldValue>) => {
  const ctx = useContext(RadioContext);
  if (!ctx) {
    throw new Error('RadioOption must be used inside of a <RadioField>');
  }

  return (
    <FormControlLabel
      labelPlacement={ctx.labelPlacement}
      {...props}
      label={label}
      disabled={disabledProp || ctx.disabled}
      control={<Radio value={value} />}
    />
  );
};

export const RadioField = <FieldValue extends any = string>({
  children,
  name: nameProp,
  label,
  helperText,
  labelPlacement,
  ...props
}: RadioFieldProps<FieldValue>) => {
  const name = useFieldName(nameProp);
  const { input, meta, rest } = useField(name, {
    ...props,
    required: true,
    // FF expects each radio option to be its own field.
    // However, we want them grouped up because it works better with MUI &
    // you only have to specify field name, validators, etc. once.
    // type: 'radio',
  });
  const disabled = props.disabled || meta.submitting;
  const classes = useStyles();
  return (
    <FormControl
      color="primary"
      {...rest}
      component="fieldset"
      error={showError(meta)}
      required
      disabled={disabled}
    >
      {label && (
        <FormLabel component="legend" className={classes.fieldLabel}>
          {label}
        </FormLabel>
      )}
      <RadioContext.Provider value={{ disabled, labelPlacement }}>
        <RadioGroup
          {...input}
          // Pass value instead of event to FF, so FF doesn't try to be smart
          // with its radio logic since we/MUI is already handling it.
          onChange={(e) => input.onChange(e.target.value)}
        >
          {children}
        </RadioGroup>
      </RadioContext.Provider>
      <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
    </FormControl>
  );
};

interface RadioContextValue {
  disabled: boolean;
  labelPlacement: LabelPlacement;
}

const RadioContext = createContext<RadioContextValue | undefined>(undefined);
RadioContext.displayName = 'RadioContext';
