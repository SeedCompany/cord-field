import { TextField, TextFieldProps } from '@material-ui/core';
import {
  DatePicker,
  DatePickerProps,
  MaterialUiPickersDate,
  useUtils,
} from '@material-ui/pickers';
import {
  DateValidationError,
  DateValidationProps,
} from '@material-ui/pickers/_helpers/date-utils';
import { MuiPickersAdapter } from '@material-ui/pickers/_shared/hooks/useUtils';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { DateTime } from 'luxon';
import React, { useRef } from 'react';
import { Except } from 'type-fest';
import { validators } from '.';
import { CalendarDate } from '../../util';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';
import { Validator } from './validators';

export type DateFieldProps = Except<
  FieldConfig<CalendarDate | null>,
  'defaultValue' | 'initialValue' | 'validate'
> &
  Except<DatePickerProps, 'value' | 'onChange' | 'renderInput'> &
  Pick<
    TextFieldProps,
    'label' | 'disabled' | 'helperText' | 'placeholder' | 'fullWidth'
  > & {
    name: string;
    defaultValue?: string | CalendarDate | null;
    initialValue?: string | CalendarDate | null;
    errorMessages?: Record<DateError, string>;
    // Disable replacing helper text with format while text input is focused
    disableFormatHelperText?: boolean;
  };

export const DateField = ({
  helperText: helperTextProp,
  defaultValue: defaultValueProp,
  initialValue: initialValueProp,
  errorMessages,
  disableFormatHelperText,
  placeholder,
  ...props
}: DateFieldProps) => {
  const utils = useUtils();
  const validator: Validator<DateTime | null> = (val) => {
    const allProps = {
      ...defaultRange,
      ...props,
    };
    let error: DateError | null = validateDate(utils, val, allProps);
    if (!error) {
      return undefined;
    }
    if (error === 'maxDate' && !props.maxDate) {
      error = 'maxDateUnbound';
    } else if (error === 'minDate' && !props.minDate) {
      error = 'minDateUnbound';
    }
    return error;
  };

  const initialValue = useDate(initialValueProp);
  const defaultValue = useDate(defaultValueProp);

  const { input, meta, ref, rest } = useField<DateTime | null>({
    isEqual: isDateEqual,
    ...props,
    defaultValue,
    initialValue,
    validate: [validator, props.required ? validators.required : null],
  });
  const { value, onChange, onFocus, onBlur } = input;
  const open = useRef(false);

  // Show understood date but invalid selection errors immediately
  // Leave invalid text input to be shown only after touched as usual
  const error = showError(meta) || (meta.error && meta.error !== 'invalidDate');
  const humanError = { ...defaultMessages, ...errorMessages }[
    meta.error as DateError
  ];
  const helperText = getHelperText(
    {
      ...meta,
      error: humanError,
    },
    meta.active && !open.current && !disableFormatHelperText
      ? humanFormat
      : helperTextProp,
    error
  );

  return (
    <DatePicker
      views={['year', 'month', 'date']}
      openTo={value ? 'date' : 'year'}
      disabled={meta.disabled}
      clearable={!props.required}
      autoOk
      {...defaultRange}
      {...rest}
      inputFormat={inputFormat}
      value={value}
      onOpen={() => {
        open.current = true;
        onFocus();
      }}
      onClose={() => {
        open.current = false;
        onBlur();
      }}
      // any bc component doesn't have correct generic applied upstream
      onChange={(d: any | DateTime | null) =>
        onChange(d ? CalendarDate.fromDateTime(d) : d)
      }
      renderInput={(params) => (
        <TextField
          autoComplete="off"
          {...params}
          onFocus={() => {
            if (!open.current) {
              onFocus();
            }
          }}
          onBlur={() => {
            if (!open.current) {
              onBlur();
            }
          }}
          inputProps={{
            ...params.inputProps,
            placeholder,
          }}
          name={input.name}
          inputRef={ref}
          helperText={helperText}
          error={error}
          autoFocus={props.autoFocus}
          // not applying focused prop here because the field is readonly
          // until some kind of setup is complete. Not going to mess with it.
          // field still "auto focuses" after this setup is complete.
        />
      )}
    />
  );
};

type DateError =
  | NonNullable<DateValidationError>
  | 'minDateUnbound'
  | 'maxDateUnbound';

const defaultMessages: Record<DateError, string> = {
  invalidDate: 'Invalid date format',
  minDate: 'Date should not be before minimum date',
  maxDate: 'Date should not be after maximum date',
  minDateUnbound: 'Date is too far in the past',
  maxDateUnbound: 'Date is too far in the future',
  disableFuture: 'Date cannot be in the future',
  disablePast: 'Date cannot be in the past',
  shouldDisableDate: 'Date is unavailable',
};

const defaultRange = {
  minDate: CalendarDate.fromISO('1900-01-01'),
  maxDate: CalendarDate.fromISO('2100-01-01').minus({ day: 1 }),
};

// Derive format based on locale
// force two digit days & months since masked input
// doesn't like variable number of digits
const inputFormat = CalendarDate.fromObject({
  year: 1234,
  month: 11,
  day: 29,
  zone: 'utc',
})
  .toLocaleString(CalendarDate.DATE_SHORT)
  .replace('1234', 'yyyy')
  .replace('11', 'MM')
  .replace('29', 'dd');
export const humanFormat = inputFormat.toLowerCase();

type DateInput = string | CalendarDate | null | undefined;

/**
 * Memoizes date objects to prevent re-renders & parses ISO strings
 */
const useDate = (valIn: DateInput) => {
  const curr = useRef(valIn);
  const parsed = useRef<CalendarDate | null>();
  if (parsed.current !== undefined && isDateEqual(curr.current, valIn)) {
    return parsed.current;
  }
  curr.current = valIn;
  parsed.current = !valIn
    ? null
    : typeof valIn === 'string'
    ? CalendarDate.fromISO(valIn)
    : valIn;
  return parsed.current;
};

const isDateEqual = (a: DateInput, b: DateInput) => {
  if (!a && !b) {
    return true;
  }
  if ((a && !b) || (b && !a)) {
    return false;
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a === b;
  }
  if (DateTime.isDateTime(a) && DateTime.isDateTime(b)) {
    return a.toISODate() === b.toISODate();
  }
  return false;
};

// Copied from un-exported @material-ui/pickers/_helpers/date-utils
const validateDate = (
  utils: MuiPickersAdapter,
  value: MaterialUiPickersDate | ParsableDate,
  {
    minDate,
    maxDate,
    disableFuture,
    shouldDisableDate,
    disablePast,
  }: DateValidationProps
) => {
  const now = utils.date();
  const date = utils.date(value);

  if (value === null) {
    return null;
  }

  switch (true) {
    case !utils.isValid(value):
      return 'invalidDate';

    case Boolean(shouldDisableDate?.(date)):
      return 'shouldDisableDate';

    case Boolean(disableFuture && utils.isAfterDay(date, now)):
      return 'disableFuture';

    case Boolean(disablePast && utils.isBeforeDay(date, now)):
      return 'disablePast';

    case Boolean(minDate && utils.isBeforeDay(date, minDate)):
      return 'minDate';

    case Boolean(maxDate && utils.isAfterDay(date, maxDate)):
      return 'maxDate';

    default:
      return null;
  }
};
