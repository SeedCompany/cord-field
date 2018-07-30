import { ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';
import { validatePair } from './helpers';

function assertNullableDateTime(value: any): void {
  if (value && !(value instanceof DateTime)) {
    throw new Error('Value is not an not a DateTime object.');
  }
}

export function isValidDateRange(start: DateTime, end: DateTime, allowSameDay: boolean): boolean {
  return allowSameDay
    ? start.startOf('day') <= end.startOf('day')
    : start.startOf('day') < end.startOf('day');
}

export function dateRange(startFieldName: string, endFieldName: string, allowSameDay = true): ValidatorFn {
  const validator = (start: DateTime, end: DateTime) => isValidDateRange(start, end, allowSameDay);
  return validatePair(startFieldName, endFieldName, 'invalidRange', validator, assertNullableDateTime);
}
