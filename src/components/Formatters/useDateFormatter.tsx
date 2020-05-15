import { isString } from 'lodash';
import { DateTime } from 'luxon';
import { CalendarDate } from '../../util';

export const useDateFormatter = () => (date: CalendarDate | string) => {
  const dt = isString(date) ? CalendarDate.fromISO(date) : date;
  return dt.toLocaleString(DateTime.DATE_SHORT);
};

export const useDateTimeFormatter = () => (date: DateTime | string) => {
  const dt = isString(date) ? DateTime.fromISO(date) : date;
  return dt.toLocaleString(DateTime.DATETIME_SHORT);
};
