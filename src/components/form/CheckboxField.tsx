import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
} from '@material-ui/core';
import React, { FC, ReactNode } from 'react';
import { FieldConfig, useField } from './useField';

export type CheckboxFieldProps = FieldConfig<boolean> & {
  name: string;
  helperText?: ReactNode;
} & Omit<CheckboxProps, 'defaultValue' | 'value'> &
  Pick<FormControlLabelProps, 'label' | 'labelPlacement'> &
  Pick<FormControlProps, 'fullWidth' | 'margin' | 'variant'>;

export const CheckboxField: FC<CheckboxFieldProps> = ({
  name,
  label,
  labelPlacement,
  helperText: nonErrorHelperText,
  defaultValue = false,
  disabled,
  fullWidth,
  margin,
  variant,
  ...props
}) => {
  const { input, meta, rest } = useField(name, { defaultValue, ...props });
  const helperText = meta.showError
    ? meta.error || meta.submitError
    : nonErrorHelperText;
  return (
    <FormControl
      required={props.required}
      error={meta.showError}
      disabled={disabled || meta.submitting}
      fullWidth={fullWidth}
      margin={margin}
      variant={variant}
    >
      <FormControlLabel
        name={name}
        label={label}
        labelPlacement={labelPlacement}
        control={
          <Checkbox
            color="primary"
            {...rest}
            checked={input.value}
            value={name}
            onChange={(e) => input.onChange(e.target.checked)}
            required={props.required}
          />
        }
      />
      <FormHelperText>{helperText || ' '}</FormHelperText>
    </FormControl>
  );
};
