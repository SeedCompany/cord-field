import {
  DatePicker,
  useUtils,
  validate as validateDate,
} from '@material-ui/pickers';
import { DateTime } from 'luxon';
import React, { ComponentProps, useMemo } from 'react';
import { Except } from 'type-fest';
import { validators } from '.';
import { CalendarDate } from '../../util';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError, useFocusOnEnabled } from './util';
import { Validator } from './validators';

type DatePickerProps = ComponentProps<typeof DatePicker>;

export interface DateFieldProps
  extends Except<FieldConfig<DateTime | null>, 'initialValue' | 'validate'>,
    Except<DatePickerProps, 'defaultValue' | 'value' | 'onChange' | 'name'> {
  name: string;
  initialValue?: string | DateTime | null;
}

export const DateField = ({
  name,
  helperText,
  disabled: disabledProp,
  children,
  initialValue: initialValueProp,
  ...props
}: DateFieldProps) => {
  const utils = useUtils();
  const validator: Validator<DateTime | null> = (val) => {
    const allProps = {
      ...datePickerDefaultProps,
      ...props,
    };
    const error = validateDate(val, utils, allProps);
    if (error === allProps.maxDateMessage && !props.maxDate) {
      return 'Date is too far in the future';
    }
    if (error === allProps.minDateMessage && !props.minDate) {
      return 'Date is too far in the past';
    }
    return error as string | undefined;
  };

  const initialValue = useMemo(
    () =>
      typeof initialValueProp === 'string'
        ? CalendarDate.fromISO(initialValueProp)
        : initialValueProp,
    [initialValueProp]
  );

  const { input, meta, rest } = useField<DateTime | null>(name, {
    isEqual: isDateEqual,
    ...props,
    initialValue,
    validate: [validator, props.required ? validators.required : null],
  });
  const disabled = disabledProp ?? meta.submitting;
  const ref = useFocusOnEnabled(meta, disabled);

  return (
    <DatePicker
      views={['year', 'month', 'date']}
      disabled={disabled}
      clearable={!props.required}
      // default luxon value does not work with masked inputs
      // since there's no zero padding
      inputFormat="MM/dd/yyyy"
      autoOk
      autoComplete="off"
      {...rest}
      {...input}
      inputRef={ref}
      onChange={(d) => input.onChange(d ? CalendarDate.fromDateTime(d) : d)}
      name={name}
      helperText={getHelperText(meta, helperText)}
      error={showError(meta)}
    >
      {children}
    </DatePicker>
  );
};

const datePickerDefaultProps: Partial<DatePickerProps> = {
  minDate: new Date('1900-01-01'),
  maxDate: new Date('2100-01-01'),
  invalidDateMessage: 'Invalid Date Format',
  minDateMessage: 'Date should not be before minimum date',
  maxDateMessage: 'Date should not be after maximum date',
};

const isDateEqual = (a: any, b: any) => {
  if (!a && !b) {
    return true;
  }
  if ((a && !b) || (b && !a)) {
    return false;
  }
  if (DateTime.isDateTime(a) && DateTime.isDateTime(b)) {
    return a.toISODate() === b.toISODate();
  }
  return false;
};
