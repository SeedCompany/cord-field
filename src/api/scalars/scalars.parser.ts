import { DateTime } from 'luxon';
import { CalendarDate } from '../../util';

export const Parsers = {
  Date: (val: string) => CalendarDate.fromISO(val),
  DateTime: (val: string) => DateTime.fromISO(val),
};
