import { DateTime } from 'luxon';
import { CalendarDate } from '../../../util';

// Our new strict types for type policies doesn't account for custom scalars
// which are actually stored in cache differently than TS declares.
// Ignoring this for now. We can circle back when it becomes more of a problem.
export const Parsers: any = {
  Date: (val: string) => CalendarDate.fromISO(val),
  DateTime: (val: string) => DateTime.fromISO(val),
};

export const optional =
  <T, R>(parser: (val: T) => R) =>
  (val: T | null | undefined): R | null =>
    val != null ? parser(val) : null;
