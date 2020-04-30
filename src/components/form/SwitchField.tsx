import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  Switch,
  SwitchProps,
} from '@material-ui/core';
import { FieldConfig } from 'final-form';
import React, { FC, ReactNode } from 'react';
import { useField } from 'react-final-form';
import { useFieldName } from './FieldGroup';
import { getHelperText, showError, useFocusOnEnabled } from './util';

export type SwitchFieldProps = FieldConfig<boolean> & {
  name: string;
  helperText?: ReactNode;
} & Pick<FormControlLabelProps, 'label' | 'labelPlacement'> &
  Pick<FormControlProps, 'fullWidth' | 'margin' | 'variant'> &
  Omit<SwitchProps, 'defaultValue' | 'value' | 'inputRef'>;

export const SwitchField: FC<SwitchFieldProps> = ({
  name: nameProp,
  label,
  color,
  labelPlacement,
  helperText,
  defaultValue = false,
  disabled: disabledProp,
  fullWidth,
  margin,
  variant,
  ...props
}) => {
  const name = useFieldName(nameProp);
  const { input, meta, rest } = useField(name, { defaultValue, ...props });
  const disabled = disabledProp ?? meta.submitting;
  const ref = useFocusOnEnabled<HTMLInputElement>(meta, disabled!);
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
          <Switch
            color={color}
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
