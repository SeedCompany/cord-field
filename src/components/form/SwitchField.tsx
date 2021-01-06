import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  Switch,
  SwitchProps,
} from '@material-ui/core';
import React, { FC, ReactNode } from 'react';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

export type SwitchFieldProps = FieldConfig<boolean> & {
  name: string;
  helperText?: ReactNode;
} & Omit<SwitchProps, 'defaultValue' | 'value' | 'inputRef'> &
  Pick<FormControlLabelProps, 'label' | 'labelPlacement'> &
  Pick<FormControlProps, 'fullWidth' | 'margin' | 'variant'>;

export const SwitchField: FC<SwitchFieldProps> = ({
  label,
  labelPlacement,
  helperText,
  defaultValue = false,
  fullWidth,
  margin,
  variant,
  ...props
}) => {
  const { input, meta, ref, rest } = useField({
    defaultValue,
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
            checked={input.checked}
            value={input.name}
            onChange={(e) => input.onChange(e.target.checked)}
            required={props.required}
          />
        }
      />
      <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
    </FormControl>
  );
};
