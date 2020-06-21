import { DateTime } from 'luxon';
import { CalendarDate, Nullable } from '../../util';

export const useDateFormatter = () => (date: Nullable<CalendarDate>) =>
  date ? date.toLocaleString(DateTime.DATE_SHORT) : '';

export const useDateTimeFormatter = () => (date: Nullable<DateTime>) =>
  date ? date.toLocaleString(DateTime.DATETIME_SHORT) : '';
