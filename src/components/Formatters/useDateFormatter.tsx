import { DateTime } from 'luxon';
import { CalendarDate } from '../../util';

export const useDateFormatter = () => (date: CalendarDate) =>
  date.toLocaleString(DateTime.DATE_SHORT);

export const useDateTimeFormatter = () => (date: DateTime) =>
  date.toLocaleString(DateTime.DATETIME_SHORT);
