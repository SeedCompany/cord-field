import { TextField, TextFieldProps } from '@mui/material';
import {
  DatePicker,
  DatePickerProps,
  MuiPickersAdapterContext,
} from '@mui/x-date-pickers';
import {
  // eslint-disable-next-line @seedcompany/no-restricted-imports
  DateValidationError,
  // eslint-disable-next-line @seedcompany/no-restricted-imports
  validateDate,
} from '@mui/x-date-pickers/internals';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { MuiPickersAdapterContextValue } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { DateTime } from 'luxon';
import { useContext, useRef } from 'react';
import { Except } from 'type-fest';
import { CalendarDate, Nullable } from '~/common';
import { AllowFormCloseContext } from './AllowClose';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';
import { required as requiredValidator, Validator } from './validators';

export type DateFieldProps = Except<
  FieldConfig<CalendarDate | null>,
  'defaultValue' | 'initialValue' | 'validate'
> &
  Except<
    DatePickerProps<string | CalendarDate | null, CalendarDate>,
    'value' | 'onChange' | 'renderInput'
  > &
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
  const i10nCtx = useLocalization();
  const validator: Validator<Nullable<CalendarDate>> = (val) => {
    let error: DateError | null = validateDate({
      // @ts-expect-error BaseDateValidationProps are typed as required. They are not.
      props,
      value: val,
      adapter: i10nCtx,
    });
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

  const { input, meta, ref, rest } = useField<
    CalendarDate,
    false,
    HTMLDivElement
  >({
    isEqual: isDateEqual,
    ...props,
    defaultValue,
    initialValue,
    validate: [validator, props.required ? requiredValidator : null],
  });
  const { value, onChange, onFocus, onBlur } = input;
  const open = useRef(false);

  // Show errors for understood but invalid dates immediately
  // Leave invalid text input to be shown only after touched as usual
  const hasError =
    showError(meta) ||
    (meta.error && meta.error !== 'invalidDate' && meta.error !== 'Required');
  const humanError =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    {
      ...defaultMessages,
      ...errorMessages,
      Required: 'Required',
    }[meta.error as string] ?? meta.error;
  const helperText = getHelperText(
    {
      ...meta,
      error: humanError,
    },
    helperTextProp,
    hasError
  );

  const allowFormClose = useContext(AllowFormCloseContext);

  return (
    <DatePicker<CalendarDate | null | undefined>
      views={['year', 'month', 'day']}
      openTo={value ? 'day' : 'year'}
      disabled={meta.disabled}
      componentsProps={{
        actionBar: {
          actions: (variant) => [
            'today',
            ...(!props.required ? (['clear'] as const) : []), // clearable
            ...(variant === 'mobile' ? (['cancel', 'accept'] as const) : []),
          ],
        },
      }}
      showDaysOutsideCurrentMonth
      {...rest}
      ref={ref}
      value={value}
      onOpen={() => {
        open.current = true;
        allowFormClose(input.name, false);
        onFocus();
      }}
      onClose={() => {
        open.current = false;
        allowFormClose(input.name, true);
        onBlur();
      }}
      onChange={onChange}
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
            placeholder: placeholder ?? params.inputProps?.placeholder,
          }}
          name={input.name}
          helperText={helperText}
          error={hasError}
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
  disablePast: 'Date cannot be in the past',
  shouldDisableDate: 'Date is unavailable',
};

type DateInput = string | CalendarDate | null | undefined;

const uninitialized = Symbol('uninitialized');

/**
 * Memoizes date objects to prevent re-renders & parses ISO strings
 */
const useDate = (valIn: DateInput): CalendarDate | null | undefined => {
  const curr = useRef(valIn);
  const parsed = useRef<CalendarDate | null | undefined | typeof uninitialized>(
    uninitialized
  );
  if (parsed.current !== uninitialized && isDateEqual(curr.current, valIn)) {
    return parsed.current;
  }
  curr.current = valIn;
  parsed.current = !valIn
    ? undefined
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

const useLocalization = () =>
  useContext<MuiPickersAdapterContextValue<CalendarDate>>(
    MuiPickersAdapterContext as any
  );
