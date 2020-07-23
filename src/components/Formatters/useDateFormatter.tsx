import { DateTime } from 'luxon';
import { CalendarDate, Nullable } from '../../util';

// These are hooks so that they can pull from context later if needed
// for current locale.

// Returns function for format date or date range
export const useDateFormatter = () => formatDate;

const formatDate = (date: Nullable<CalendarDate>) =>
  date ? date.toLocaleString(DateTime.DATE_SHORT) : '';

formatDate.range = rangeFormatter(formatDate);

// Returns function for format date time or date time range
export const useDateTimeFormatter = () => formatDateTime;

const formatDateTime = (date: Nullable<DateTime>) =>
  date ? date.toLocaleString(DateTime.DATETIME_SHORT) : '';

formatDateTime.range = rangeFormatter(formatDateTime);

function rangeFormatter<T extends DateTime>(
  formatter: (d: Nullable<T>) => string
) {
  function formatRange(start: Nullable<T>, end: Nullable<T>): string;
  function formatRange(
    range: Nullable<{ start: Nullable<T>; end: Nullable<T> }>
  ): string;
  function formatRange(
    rangeOrStart: Nullable<{ start: Nullable<T>; end: Nullable<T> } | T>,
    end?: Nullable<T>
  ) {
    const start =
      rangeOrStart && 'start' in rangeOrStart
        ? rangeOrStart.start
        : rangeOrStart;
    const actualEnd =
      rangeOrStart && 'end' in rangeOrStart ? rangeOrStart.end : end;
    if (!start && !actualEnd) {
      return null;
    }
    return formatter(start) + ' - ' + formatter(actualEnd);
  }

  return formatRange;
}
