import { DateTime } from 'luxon';
import { useContext } from 'react';
import { RequestContext, useLocale } from '../../hooks';
import { CalendarDate, Nullable } from '../../util';

const isClient = typeof window !== 'undefined';

const useTimezone = () => {
  const req = useContext(RequestContext);
  const rawTz = req?.cookies.tz;
  const timezone = typeof rawTz === 'string' ? rawTz : undefined;
  return timezone;
};

// Returns function for format date or date range
export const useDateFormatter = () => {
  const locale = useLocale();

  const formatDate = (date: Nullable<CalendarDate>) =>
    date ? date.toLocaleString({ ...DateTime.DATE_SHORT, locale }) : '';
  formatDate.range = rangeFormatter(formatDate);
  return formatDate;
};

// Returns function for format date time or date time range
export const useDateTimeFormatter = () => {
  const locale = useLocale();
  const timeZone = useTimezone();

  const formatDateTime = (date: Nullable<DateTime>) =>
    date
      ? date.toLocaleString({
          ...DateTime.DATETIME_SHORT,
          // If we don't know the timezone, format with the timezone
          // so the client's current timezone is not assumed.
          // This will be mitigated once the client hydrates.
          timeZoneName: !isClient && !timeZone ? 'short' : undefined,
          locale,
          timeZone,
        })
      : '';

  formatDateTime.range = rangeFormatter(formatDateTime);
  return formatDateTime;
};

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
