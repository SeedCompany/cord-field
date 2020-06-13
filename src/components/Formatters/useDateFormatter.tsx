import { DateTime } from 'luxon';
import { CalendarDate } from '../../util';

export const useDateFormatter = () => (date: CalendarDate | null | undefined) =>
  date ? date.toLocaleString(DateTime.DATE_SHORT) : '';

export const useDateTimeFormatter = () => (date: DateTime | null | undefined) =>
  date ? date.toLocaleString(DateTime.DATETIME_SHORT) : '';
