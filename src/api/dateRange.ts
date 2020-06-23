import { DateTime, Interval } from 'luxon';
import { Merge } from 'type-fest';
import { CalendarDate, Nullable } from '../util';
import { Secured } from './secured';

interface DateRange<T> {
  start: Nullable<T>;
  end: Nullable<T>;
}

type DateInterval<T extends DateTime> = Merge<
  Interval,
  Record<'start' | 'end', T>
>;

const securedRange = <T extends DateTime>() => (
  start: Secured<T>,
  end: Secured<T>
): Secured<DateRange<T>> => ({
  canRead: start.canRead && end.canRead,
  canEdit: start.canEdit && end.canEdit,
  value:
    start.value && end.value
      ? (Interval.fromDateTimes(start.value, end.value) as DateInterval<T>)
      : { start: start.value, end: end.value },
});

export const securedDateRange = securedRange<CalendarDate>();
export const securedDateTimeRange = securedRange<DateTime>();
