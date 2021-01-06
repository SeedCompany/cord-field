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
  Pick<FormControlProps, 'fullWidth' | 'margin' | 'variant'> & {
    /**
     * Whether to render spacing even when there is no helper/error text.
     * This is enabled by default on other fields, but here it doesn't make
     * sense. Labels are usually more informative for this field and booleans
     * rarely have server errors.
     */
    keepHelperTextSpacing?: boolean;
  };

export const CheckboxField: FC<CheckboxFieldProps> = ({
  label,
  labelPlacement,
  helperText,
  defaultValue = false,
  fullWidth,
  margin,
  variant,
  keepHelperTextSpacing,
  ...props
}) => {
  const { input, meta, rest } = useField({ defaultValue, ...props });
  const ref = useFocusOnEnabled<HTMLInputElement>(meta);

  const inputValueIsValid =
    (input.value as unknown) === false || (input.value as unknown) === true;

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
          <Checkbox
            {...rest}
            inputRef={ref}
            checked={inputValueIsValid ? input.value : defaultValue}
            value={input.name}
            onChange={(e) => input.onChange(e.target.checked)}
            required={props.required}
          />
        }
      />
      <FormHelperText>
        {getHelperText(meta, helperText, undefined, !keepHelperTextSpacing)}
      </FormHelperText>
    </FormControl>
  );
};
