import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import clsx from 'clsx';
import { sortBy } from 'lodash';
import * as React from 'react';
import {
  createContext,
  FocusEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { Except, MergeExclusive } from 'type-fest';
import { many } from '../../util';
import { useFieldName } from './FieldGroup';
import { FieldConfig, useField } from './useField';
import { areListsEqual, getHelperText, showError } from './util';
import { required, requiredArray, Validator } from './validators';

type EnumVal<T extends string, Multiple extends boolean | undefined = never> =
  // be loose if multiple is not specified;
  // useful for internal usage which handles both.
  // Otherwise it is a list or single value based on multiple boolean.
  [Multiple] extends [never]
    ? readonly T[] | T | null
    : Multiple extends true
    ? readonly T[]
    : T | null;

export type EnumFieldProps<
  T extends string,
  Multiple extends boolean | undefined
> = {
  multiple?: Multiple;
  variant?:
    | 'checkbox'
    | 'toggle-split'
    | 'toggle-grouped'
    | (Multiple extends true ? never : 'radio')
    | symbol; // ignore. just so we can say there's more here in the future
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
  disabled?: boolean;
  layout?: 'row' | 'column' | 'two-column';
} & Except<FieldConfig<EnumVal<T, Multiple>>, 'multiple' | 'type'> &
  MergeExclusive<
    { children: ReactNode },
    {
      options: readonly T[];
      getLabel?: (option: T) => string;
      // This can be a label to show an empty option or a rendered EnumOption.
      defaultOption?: string | ReactNode;
    }
  >;

const useStyles = makeStyles(({ typography, spacing }) => ({
  fieldLabel: {
    fontWeight: typography.weight.bold,
  },
  toggleSplitContainer: {
    margin: spacing(-1),
    padding: spacing(1, 0),
  },
  toggleGroupedContainer: {
    margin: spacing(1, 0),
  },
}));

const defaultDefaultValue = [] as const;

export const EnumField = <
  T extends string,
  Multiple extends boolean | undefined
>(
  props: EnumFieldProps<T, Multiple>
) => {
  const {
    multiple,
    variant = multiple ? 'checkbox' : 'radio',
    defaultValue: defaultValueProp,
    name: nameProp,
    label,
    helperText,
    layout = 'row',
    options,
    getLabel,
    defaultOption,
    children: childrenProp,
  } = props;

  if (multiple && variant === 'radio') {
    throw new Error(
      'EnumField.variant=radio cannot be used with multiple=true'
    );
  }
  if (!childrenProp && !options) {
    throw new Error('Either children or options list is required');
  }
  if (childrenProp && options) {
    throw new Error('Only children or options list can be provided');
  }
  if (layout === 'two-column') {
    if (childrenProp) {
      throw new Error(
        'Two column layout cannot be applied automatically with custom children'
      );
    }
    if (variant === 'toggle-grouped') {
      throw new Error(
        'Two column layout cannot be applied to toggle grouped variant'
      );
    }
  }

  // Memoize defaultValue so array can be passed inline while still preventing
  // the new array instance from causing re-renders when not changing.
  const defaultValue = useMemo(
    () => (defaultValueProp ?? multiple ? defaultDefaultValue : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      multiple,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      defaultValueProp
        ? sortBy(many(defaultValueProp ?? '')).join('')
        : undefined,
    ]
  );

  const name = useFieldName(nameProp);
  // FF handles checkboxes natively but we want one field instance, where FF's
  // has multiple. One field means name only has to be specified once and
  // validation can be done as a group (i.e. check 2+)
  const { input, meta } = useField<EnumVal<T>>(name, {
    // Enforce defaultValue is an array, else an empty string will be used.
    defaultValue,
    isEqual: multiple ? areListsEqual : undefined,
    allowNull: !multiple,
    validate: (props.validate ?? props.required
      ? multiple
        ? requiredArray
        : required
      : undefined) as Validator<EnumVal<T>>,
    format: undefined, // Why does TS need this???
  });

  const classes = useStyles();

  const disabled = props.disabled ?? meta.submitting;

  const { onChange, onBlur, onFocus } = input;

  const value = useMemo(
    (): Set<T> | T | null =>
      multiple
        ? new Set(input.value as readonly T[])
        : ((input.value || defaultValue) as T | null),
    // eslint-disable-next-line react-hooks/exhaustive-deps,@typescript-eslint/no-unnecessary-condition
    [input.value ? sortBy(many(input.value ?? '')).join('') : undefined]
  );

  const isChecked = useCallback(
    (optionVal: T | undefined) => {
      if (multiple) {
        const current = value as Set<T>;
        return optionVal ? current.has(optionVal) : current.size === 0;
      }
      return value === (optionVal ?? null);
    },
    [multiple, value]
  );

  const onOptionChange = useCallback(
    (optionVal: T | undefined, checked: boolean) => {
      if (!optionVal) {
        onChange(multiple ? [] : null);
        return;
      }
      if (!multiple) {
        if (checked) {
          onChange(optionVal);
        } else if (props.required) {
          return; // do nothing
        } else {
          onChange(undefined);
        }
        return;
      }

      const newVal = new Set<T>(value as Set<T>);
      if (checked) {
        newVal.add(optionVal);
      } else {
        newVal.delete(optionVal);
        if (props.required && newVal.size === 0) {
          return; // don't allow last option to be unchecked
        }
      }
      onChange([...newVal]);
    },
    [multiple, onChange, props.required, value]
  );

  const context = useMemo(
    (): EnumContextValue<T> => ({
      variant,
      isChecked,
      onChange: onOptionChange,
      onFocus,
      onBlur,
      fieldName: name,
      disabled,
    }),
    [disabled, isChecked, name, onBlur, onFocus, onOptionChange, variant]
  );

  let children = childrenProp ?? [
    ...(typeof defaultOption === 'string'
      ? [<EnumOption default label={defaultOption} key="enum default" />]
      : defaultOption
      ? [defaultOption]
      : []),
    ...options!.map((option) => (
      <EnumOption
        key={option}
        value={option}
        label={getLabel?.(option) ?? option}
      />
    )),
  ];
  if (layout === 'two-column') {
    children = (
      <Grid container>
        {(children as ReactElement[]).map((child) => (
          <Grid item xs={6} key={child.key!}>
            {child}
          </Grid>
        ))}
      </Grid>
    );
  }

  const renderedOptions =
    variant === 'checkbox' || variant === 'toggle-split' ? (
      <FormGroup
        classes={{
          root: clsx({
            [classes.toggleSplitContainer]: variant === 'toggle-split',
          }),
        }}
        row={layout === 'row'}
      >
        {children}
      </FormGroup>
    ) : variant === 'toggle-grouped' ? (
      <ToggleButtonGroup
        exclusive={!multiple}
        orientation={layout === 'row' ? 'horizontal' : 'vertical'}
        className={classes.toggleGroupedContainer}
      >
        {children}
      </ToggleButtonGroup>
    ) : variant === 'radio' ? (
      <RadioGroup row={layout === 'row'}>{children}</RadioGroup>
    ) : null;

  return (
    <FormControl
      color="primary"
      component="fieldset"
      error={showError(meta)}
      disabled={disabled}
      onFocus={(e: FocusEvent<HTMLElement>) => {
        // no need to call focus if already active
        if (!meta.active) {
          onFocus(e);
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
        onBlur(e);
      }}
      // If FF says we're focused, show us as focused, regardless of actual focus
      focused={meta.active}
    >
      {label && (
        <FormLabel component="legend" className={classes.fieldLabel}>
          {label}
        </FormLabel>
      )}
      <EnumContext.Provider value={context}>
        {renderedOptions}
      </EnumContext.Provider>
      <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
    </FormControl>
  );
};

export type EnumOptionsProps<T extends string> = {
  label: ReactNode;
  disabled?: boolean;
} & MergeExclusive<{ value: T }, { default: true }>;

export const EnumOption = <T extends string>(props: EnumOptionsProps<T>) => {
  const { variant, isChecked, onChange, ...ctx } = useEnumContext<T>();
  const { disabled = ctx.disabled, value: name, default: _, ...rest } = props;

  if (variant === 'checkbox' || variant === 'radio') {
    return (
      <FormControlLabel
        {...rest}
        name={name ?? 'default'}
        checked={isChecked(name)}
        onChange={(_, checked) => onChange(name, checked)}
        disabled={disabled}
        control={variant === 'checkbox' ? <Checkbox /> : <Radio />}
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
  } else if (variant === 'toggle-split' || variant === 'toggle-grouped') {
    const selected = isChecked(name);
    return (
      <ToggleButton
        {...rest}
        value={name ?? 'default'}
        selected={selected}
        onChange={(_) => onChange(name, !selected)}
        disabled={disabled}
      >
        {props.label}
      </ToggleButton>
    );
  }

  return null;
};

interface EnumContextValue<Opt extends string> {
  fieldName: string;
  variant: NonNullable<EnumFieldProps<any, false>['variant']>;
  isChecked: (optName: Opt | undefined) => boolean;
  onChange: (optName: Opt | undefined, checked: boolean) => void;
  disabled: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

const EnumContext = createContext<EnumContextValue<any> | undefined>(undefined);
EnumContext.displayName = 'EnumContext';

const useEnumContext = <Opt extends string>() => {
  const ctx = useContext(EnumContext);
  if (!ctx) {
    throw new Error('Enum option must be inside of a <EnumField>');
  }
  return ctx as EnumContextValue<Opt>;
};
