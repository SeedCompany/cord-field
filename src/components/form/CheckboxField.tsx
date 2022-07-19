import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
} from '@material-ui/core';
import { ReactNode } from 'react';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

export type CheckboxFieldProps = FieldConfig<
  boolean,
  false,
  HTMLInputElement
> & {
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

export function CheckboxField({
  label,
  labelPlacement,
  helperText,
  defaultValue: defaultValueProp,
  fullWidth,
  margin,
  variant,
  keepHelperTextSpacing,
  ...props
}: CheckboxFieldProps) {
  const defaultValue = defaultValueProp ?? false;

  const { input, meta, ref, rest } = useField<boolean, false, HTMLInputElement>(
    {
      defaultValue,
      ...props,
    }
  );

  return (
    <FormControl
      required={props.required}
      error={showError(meta)}
      disabled={meta.disabled}
      focused={meta.focused}
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
            checked={isBoolean(input.value) ? input.value : defaultValue}
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
}

const isBoolean = (value: unknown): value is boolean =>
  value === false || value === true;
