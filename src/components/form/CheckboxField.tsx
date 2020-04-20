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
import { getHelperText, showError, useFocusOnEnabled } from './util';

export type CheckboxFieldProps = FieldConfig<boolean> & {
  name: string;
  helperText?: ReactNode;
} & Omit<CheckboxProps, 'defaultValue' | 'value' | 'inputRef'> &
  Pick<FormControlLabelProps, 'label' | 'labelPlacement'> &
  Pick<FormControlProps, 'fullWidth' | 'margin' | 'variant'>;

export const CheckboxField: FC<CheckboxFieldProps> = ({
  name,
  label,
  labelPlacement,
  helperText,
  defaultValue = false,
  disabled: disabledProp,
  fullWidth,
  margin,
  variant,
  ...props
}) => {
  const { input, meta, rest } = useField(name, { defaultValue, ...props });
  const disabled = disabledProp ?? meta.submitting;
  const ref = useFocusOnEnabled<HTMLInputElement>(meta, disabled);

  return (
    <FormControl
      required={props.required}
      error={showError(meta)}
      disabled={disabled}
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
            inputRef={ref}
            checked={input.value}
            value={name}
            onChange={(e) => input.onChange(e.target.checked)}
            required={props.required}
          />
        }
      />
      <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
    </FormControl>
  );
};
