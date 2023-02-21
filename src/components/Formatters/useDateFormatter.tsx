import { DateTime, DateTimeFormatOptions } from 'luxon';
import { useContext } from 'react';
import { CalendarDate, Nullable } from '~/common';
import { RequestContext, useLocale } from '~/hooks';

const isClient = typeof window !== 'undefined';

const useTimezone = () => {
  const req = useContext(RequestContext);
  const rawTz = req?.cookies.tz;
  const timezone = typeof rawTz === 'string' ? rawTz : undefined;
  return timezone;
};

/**
 * @deprecated Use FormattedDate component instead
 */
export const useDateFormatter = () => {
  const locale = useLocale();

  const formatDate = (
    date: Nullable<CalendarDate>,
    options?: DateTimeFormatOptions
  ) =>
    date
      ? date.toLocaleString({ ...(options ?? DateTime.DATE_SHORT) }, { locale })
      : '';
  formatDate.range = rangeFormatter(formatDate);
  return formatDate;
};

/**
 * @deprecated Use FormattedDateTime component instead
 */
export const useDateTimeFormatter = () => {
  const locale = useLocale();
  const timeZone = useTimezone();

  const formatDateTime = (
    date: Nullable<DateTime>,
    options?: DateTimeFormatOptions
  ) =>
    date
      ? date.toLocaleString(
          {
            ...(options ?? DateTime.DATETIME_SHORT),
            timeZoneName:
              options?.timeZoneName ??
              // If we don't know the timezone, format with the timezone
              // so the client's current timezone is not assumed.
              // This will be mitigated once the client hydrates.
              (!isClient && !timeZone ? 'short' : undefined),
            timeZone,
          },
          {
            locale,
          }
        )
      : '';

  formatDateTime.range = rangeFormatter(formatDateTime);
  return formatDateTime;
};

function rangeFormatter<T extends DateTime>(
  formatter: (d: Nullable<T>) => string
) {
  function formatRange(start: Nullable<T>, end: Nullable<T>): string;
  function formatRange(
    range: Nullable<{ start?: Nullable<T>; end?: Nullable<T> }>
  ): string;
  function formatRange(
    rangeOrStart: Nullable<{ start?: Nullable<T>; end?: Nullable<T> } | T>,
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
    return formatter(start as T) + ' – ' + formatter(actualEnd);
  }

  return formatRange;
}
