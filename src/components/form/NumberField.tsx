import { InputAdornment, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { Except } from 'type-fest';
import {
  FormattedTextField,
  FormattedTextFieldProps,
} from './FormattedTextField';

export type NumberFieldProps = Except<
  FormattedTextFieldProps<number | undefined>,
  'allowNull'
> &
  Partial<FormattingOptions> & {
    alignRight?: boolean;
  };

interface FormattingOptions {
  allowNegative: boolean;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
  prefix: string;
  suffix: string;
}

const acceptNumber = (string: string) =>
  (string.match(/[-\d.]+/g) || []).join('');

const negativeChars = (str: string) => str.match(/-/g)?.length ?? 0;
const removeNegatives = (str: string) => str.replace(/-/g, '');

const formatNumber = ({
  allowNegative,
  minimumFractionDigits,
  maximumFractionDigits,
}: FormattingOptions) => (string: string) => {
  if (!string) {
    return '';
  }

  if (allowNegative) {
    // Handle user-typed negatives
    if (string === '-') {
      return '-';
    }
    const negChars = negativeChars(string);
    if (negChars > 1) {
      // maintain cursor position while turning double negative to positive
      // Note this does move the cursor to the left of the comma if double is
      // inserted to the right of the comma :(
      return removeNegatives(string);
    } else if (negChars === 1) {
      const idx = string.indexOf('-');
      if (idx !== 0) {
        // neg not at beginning is from user input which means they just typed it
        // which means the number is already formatted. Skip formatting here,
        // since we need to keep the invalid dash location to maintain cursor position.
        // replace() will move it.
        return string;
      }
    }
  }

  let next = acceptNumber(string);
  if (!next) {
    return '';
  }

  if (!allowNegative) {
    next = removeNegatives(next);
  }

  // Remove consecutive periods. This allows allows typing period at period
  // without truncating the fraction.
  next = next.replace(/\.+/g, '.');

  let head = '';
  let tail = '';
  if (next.includes('.')) {
    [head, tail] = next.split('.');

    // Avoid rounding errors at toLocaleString as when user enters 1.239
    // and maxDigits=2 we must not to convert it to 1.24, it must stay 1.23
    tail = tail ? tail.slice(0, maximumFractionDigits) : '';
    next = `${head}.${tail}`;
  }

  // For fixed format numbers deleting period must be no-op.
  // Imagine you have `123.45` then delete `.` - this would normally get `12345.00`.
  // This looks bad, so we transform `12345` into `123.45` instead.
  // The main disadvantage of this, that you need carefully check input value
  // that it always has fractional part
  // if (
  //   minimumFractionDigits > 0 &&
  //   minimumFractionDigits === maximumFractionDigits &&
  //   tail == null &&
  //   head.length > 1 && // if head is 1 char, assume just starting new number
  //   false // This doesn't work with pasting values
  // ) {
  //   const paddedHead = head.padStart(
  //     minimumFractionDigits + 1 - head.length,
  //     '0'
  //   );
  //   next = `${paddedHead.slice(0, -minimumFractionDigits)}.${paddedHead.slice(
  //     -minimumFractionDigits
  //   )}`;
  // }

  let formatted = formatValidNumber(
    next === '.' ? 0 : next, // period isn't valid, format as zero
    minimumFractionDigits,
    maximumFractionDigits
  );

  if (maximumFractionDigits > 0) {
    if (!formatted.includes('.')) {
      if (next.endsWith('.')) {
        formatted += '.';
      } else if (next.startsWith('.')) {
        formatted = '0.' + formatted;
      }
    }

    if (next.includes('.')) {
      const [formattedHead, formattedTail] = formatted.split('.');

      const newHead =
        formattedHead === '0' && next.startsWith('.') ? '' : formattedHead;

      formatted = `${newHead}.${formattedTail || tail}`;
    }
  }

  return formatted;
};

const formatValidNumber = (
  string: string | number | undefined,
  minimumFractionDigits: number,
  maximumFractionDigits: number
) => {
  if (string == null) {
    return '';
  }
  const number = parseValidNumber(string);

  return number == null
    ? ''
    : number.toLocaleString('en', {
        minimumFractionDigits,
        maximumFractionDigits,
      });
};

const parseValidNumber = (string: string | number) => {
  if (typeof string === 'number') {
    return string;
  }
  const number = Number.parseFloat(string);
  return Number.isNaN(number) ? undefined : number;
};

const replaceNumber = ({ suffix }: FormattingOptions) => (string: string) => {
  let next = string;

  // move single dash to beginning of string while keeping cursor position
  const isNeg = negativeChars(string) % 2 !== 0;
  next = (isNeg ? '-' : '') + removeNegatives(next);

  next += suffix;

  return next;
};

const parseNumber = (string: string) => parseValidNumber(acceptNumber(string));

const useStyles = makeStyles(() => ({
  alignRight: {
    textAlign: 'right',
  },
}));

export const NumberField = ({
  alignRight,
  allowNegative = false,
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
  prefix = '',
  suffix = '',
  ...props
}: NumberFieldProps) => {
  const classes = useStyles();
  const formatting: FormattingOptions = {
    allowNegative,
    minimumFractionDigits,
    maximumFractionDigits,
    prefix: '',
    suffix,
  };
  const formatInput = formatNumber(formatting);
  const replace = replaceNumber(formatting);
  return (
    <FormattedTextField<number | undefined>
      accept={/[\d-.]/g}
      formatInput={formatInput}
      replace={replace}
      format={(val) =>
        formatValidNumber(val, minimumFractionDigits, maximumFractionDigits)
      }
      parse={parseNumber}
      {...props}
      type="tel"
      InputProps={{
        ...(prefix
          ? {
              startAdornment: (
                <InputAdornment position="start">{prefix}</InputAdornment>
              ),
            }
          : {}),
        ...props.InputProps,
        classes: {
          ...props.InputProps?.classes,
          input: clsx(
            alignRight && classes.alignRight,
            props.InputProps?.classes?.input
          ),
        },
      }}
    />
  );
};
