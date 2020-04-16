import {
  DatePicker,
  useUtils,
  validate as validateDate,
} from '@material-ui/pickers';
import { datePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';
import { DateTime } from 'luxon';
import React, { ComponentProps, useMemo } from 'react';
import { Except } from 'type-fest';
import { validators } from '.';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';
import { Validator } from './validators';

export interface DateFieldProps
  extends Except<FieldConfig<DateTime | null>, 'initialValue' | 'validate'>,
    Except<
      ComponentProps<typeof DatePicker>,
      'defaultValue' | 'value' | 'onChange' | 'name'
    > {
  name: string;
  initialValue?: string | DateTime | null;
}

export const DateField = ({
  name,
  helperText,
  children,
  initialValue: initialValueProp,
  ...props
}: DateFieldProps) => {
  const utils = useUtils();
  const validator: Validator<DateTime | null> = (val) => {
    const allProps = {
      ...datePickerDefaultProps,
      minDateMessage: 'Date should not be before minimum date',
      maxDateMessage: 'Date should not be after maximum date',
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
        ? DateTime.fromISO(initialValueProp)
        : initialValueProp,
    [initialValueProp]
  );

  const { input, meta, rest } = useField<DateTime | null>(name, {
    isEqual: isDateEqual,
    ...props,
    initialValue,
    validate: [validator, props.required ? validators.required : null],
  });

  return (
    <DatePicker
      views={['year', 'month', 'date']}
      disabled={meta.submitting}
      clearable={!props.required}
      // default luxon value does not work with masked inputs
      // since there's no zero padding
      inputFormat="MM/dd/yyyy"
      autoOk
      {...rest}
      {...input}
      name={name}
      helperText={getHelperText(meta, helperText)}
      error={showError(meta)}
    >
      {children}
    </DatePicker>
  );
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
