import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormGroup,
  FormGroupProps,
  FormHelperText,
  FormLabel,
  makeStyles,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonProps } from '@material-ui/lab';
import clsx from 'clsx';
import React, {
  createContext,
  FocusEvent,
  MouseEvent,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { MergeExclusive } from 'type-fest';
import { useFieldName } from './FieldGroup';
import { FieldConfig, useField } from './useField';
import { areListsEqual, getHelperText, showError } from './util';

type LabelPlacement = FormControlLabelProps['labelPlacement'];

export type CheckboxesFieldProps = FieldConfig<string[]> &
  Omit<FormControlProps, 'required'> &
  Pick<FormGroupProps, 'row'> &
  Pick<FormControlLabelProps, 'labelPlacement'> & {
    name: string;
    label?: ReactNode;
    helperText?: ReactNode;
    FormGroupProps?: FormGroupProps;
    pickOne?: boolean;
  };

export type CheckboxOptionProps = Pick<
  FormControlLabelProps,
  'label' | 'labelPlacement' | 'disabled'
> &
  MergeExclusive<{ value: string }, { default: true }>;

export type ToggleButtonOptionProps = ToggleButtonProps &
  MergeExclusive<{ value: string }, { default: true }>;

const useStyles = makeStyles(({ typography, spacing }) => ({
  fieldLabel: {
    fontWeight: typography.weight.bold,
  },
  toggleGroup: {
    margin: spacing(-1),
    padding: spacing(1, 0),
  },
}));

const defaultDefaultValue: string[] = [];

export const CheckboxesField = ({
  children,
  name: nameProp,
  label,
  helperText,
  row,
  labelPlacement = 'end',
  defaultValue: defaultValueProp,
  FormGroupProps,
  pickOne,
  ...props
}: CheckboxesFieldProps) => {
  // Memoize defaultValue so array can be passed inline while still preventing
  // the new array instance from causing re-renders when not changing.
  const defaultValue = useMemo(
    () => defaultValueProp,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultValueProp?.slice().sort().join('')]
  );

  const name = useFieldName(nameProp);

  // FF handles checkboxes natively but we want one field instance, where FF's
  // has multiple. One field means name only has to be specified once and
  // validation can be done as a group (i.e. check 2+)
  const { input, meta, rest } = useField<string[]>(name, {
    // Enforce defaultValue is an array, else an empty string will be used.
    defaultValue: defaultValue ?? defaultDefaultValue,
    ...props,
    isEqual: areListsEqual,
  });

  const classes = useStyles();

  const value = new Set(input.value);
  const disabled = props.disabled ?? meta.submitting;
  return (
    <FormControl
      color="primary"
      {...rest}
      component="fieldset"
      error={showError(meta)}
      disabled={disabled}
      onFocus={(e: FocusEvent<HTMLElement>) => {
        // no need to call focus if already active
        if (!meta.active) {
          input.onFocus(e);
        }
      }}
      onBlur={(e: FocusEvent<HTMLElement>) => {
        // Don't blur if moving focus to another checkbox option
        if (
          e.relatedTarget &&
          e.currentTarget.contains(e.relatedTarget as HTMLElement)
        ) {
          return;
        }
        input.onBlur(e);
      }}
      // If FF says we're focused, show us as focused, regardless of actual focus
      focused={meta.active}
    >
      {label && (
        <FormLabel component="legend" className={classes.fieldLabel}>
          {label}
        </FormLabel>
      )}
      <FormGroup {...FormGroupProps} row={row}>
        <CheckboxContext.Provider
          value={{
            value,
            onChange: (optName, checked) => {
              if (!optName) {
                input.onChange([]);
                return;
              }

              if (pickOne && checked) {
                input.onChange([optName]);
                return;
              }
              if (pickOne && !checked) {
                input.onChange([]);
                return;
              }
              const newVal = new Set(value);
              if (checked) {
                newVal.add(optName);
              } else {
                newVal.delete(optName);
              }
              input.onChange([...newVal]);
            },
            onFocus: input.onFocus,
            onBlur: input.onBlur,
            fieldName: name,
            disabled,
            labelPlacement,
          }}
        >
          {children}
        </CheckboxContext.Provider>
      </FormGroup>
      <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
    </FormControl>
  );
};

export const CheckboxOption = ({
  value: name,
  default: isDefault,
  disabled: disabledProp,
  ...props
}: CheckboxOptionProps) => {
  const ctx = useContext(CheckboxContext);
  if (!ctx) {
    throw new Error(
      'CheckboxOption must be used inside of a <CheckboxesField>'
    );
  }

  const disabled = disabledProp ?? ctx.disabled;
  return (
    <FormControlLabel
      labelPlacement={ctx.labelPlacement}
      {...props}
      name={name ?? 'default'}
      checked={name ? ctx.value.has(name) : ctx.value.size === 0}
      onChange={(_, checked) => ctx.onChange(name, checked)}
      disabled={disabled}
      control={<Checkbox />}
      // Prevent form control from being blurred when clicking on label.
      // And also enforce that control is focused.
      onMouseDown={(e: MouseEvent<HTMLElement>) => {
        if (disabled) {
          return;
        }
        // Don't mess with focus if clicking on checkbox since it doesn't need help
        // and preventDefault() will actually prevent blurring when wanted.
        if ((e.target as HTMLElement).tagName === 'INPUT') {
          return;
        }
        e.preventDefault();
        ctx.onFocus();
      }}
    />
  );
};

export const ToggleButtonsField = (props: CheckboxesFieldProps) => {
  const classes = useStyles();

  return (
    <CheckboxesField
      row
      {...props}
      FormGroupProps={{
        ...props.FormGroupProps,
        classes: {
          ...props.FormGroupProps?.classes,
          root: clsx(classes.toggleGroup, props.FormGroupProps?.classes?.root),
        },
      }}
    />
  );
};

export const ToggleButtonOption = ({
  label,
  value: name,
  default: isDefault,
  disabled: disabledProp,
  ...props
}: CheckboxOptionProps) => {
  const ctx = useContext(CheckboxContext);
  if (!ctx) {
    throw new Error(
      'ToggleButtonOption must be used inside of a <CheckboxesField>'
    );
  }

  const disabled = disabledProp ?? ctx.disabled;
  const selected = Boolean(name ? ctx.value.has(name) : ctx.value.size === 0);
  return (
    <ToggleButton
      {...props}
      value={ctx.value}
      selected={selected}
      onChange={(_) => ctx.onChange(name, !selected)}
      disabled={disabled}
    >
      {label}
    </ToggleButton>
  );
};

interface CheckboxContextValue {
  fieldName: string;
  value: Set<string>;
  onChange: (optName: string | undefined, checked: boolean) => void;
  disabled: boolean;
  onFocus: () => void;
  onBlur: () => void;
  labelPlacement: LabelPlacement;
}

const CheckboxContext = createContext<CheckboxContextValue | undefined>(
  undefined
);
CheckboxContext.displayName = 'CheckboxContext';
