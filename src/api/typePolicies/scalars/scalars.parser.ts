import { DateTime } from 'luxon';
import { CalendarDate } from '../../../util';

export const Parsers = {
  Date: (val: string) => CalendarDate.fromISO(val),
  DateTime: (val: string) => DateTime.fromISO(val),
};

export const optional = <T, R>(parser: (val: T) => R) => (
  val: T | null | undefined
): R | null => (val != null ? parser(val) : null);
