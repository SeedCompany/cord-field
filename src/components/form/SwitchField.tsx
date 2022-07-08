import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  Switch,
  SwitchProps,
} from '@material-ui/core';
import React, { ReactNode } from 'react';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

export type SwitchFieldProps = FieldConfig<boolean> & {
  name: string;
  helperText?: ReactNode;
} & Omit<SwitchProps, 'defaultValue' | 'value' | 'inputRef'> &
  Pick<FormControlLabelProps, 'label' | 'labelPlacement'> &
  Pick<FormControlProps, 'fullWidth' | 'margin' | 'variant'> & {
    /** Treat the "off" UI state as null instead of false */
    offIsNull?: boolean;
  };

export const SwitchField = ({
  label,
  labelPlacement,
  helperText,
  offIsNull,
  fullWidth,
  margin,
  variant,
  ...props
}: SwitchFieldProps) => {
  const { input, meta, ref, rest } = useField({
    defaultValue: offIsNull ? null : false,
    allowNull: offIsNull,
    ...props,
    type: 'checkbox',
  });

  return (
    <FormControl
      required={props.required}
      error={showError(meta)}
      disabled={meta.disabled}
      fullWidth={fullWidth}
      margin={margin}
      variant={variant}
    >
      <FormControlLabel
        name={input.name}
        label={label}
        labelPlacement={labelPlacement}
        control={
          <Switch
            {...rest}
            inputRef={ref}
            checked={input.checked ?? (offIsNull ? false : undefined)}
            value={input.name}
            onChange={(e) => {
              const checked = e.target.checked;
              const newVal = checked || (offIsNull ? null : false);
              input.onChange(newVal);
            }}
            required={props.required}
          />
        }
      />
      <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
    </FormControl>
  );
};
