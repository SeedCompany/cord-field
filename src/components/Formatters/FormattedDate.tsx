import { Tooltip } from '@mui/material';
import { useRafInterval } from 'ahooks';
import { DateTime, DateTimeFormatOptions } from 'luxon';
import { memo, useState } from 'react';
import { MergeExclusive } from 'type-fest';
import { DateRange } from '~/api/schema.graphql';
import { CalendarDate, Nullable } from '~/common';
import { useLocale } from '../../hooks';
import { useDateFormatter, useDateTimeFormatter } from './useDateFormatter';

export const FormattedDate = memo(function FormattedDate({
  date,
  displayOptions,
}: {
  date: Nullable<CalendarDate>;
  displayOptions?: DateTimeFormatOptions;
}) {
  date = asLuxonInstance(date, CalendarDate);

  const format = useDateFormatter();
  return date ? (
    <Tooltip title={format(date, DateTime.DATE_HUGE)}>
      <time dateTime={date.toISODate()}>{format(date, displayOptions)}</time>
    </Tooltip>
  ) : null;
});

export const FormattedDateRange = ({
  start,
  end,
  range,
}: MergeExclusive<
  {
    start: Nullable<CalendarDate>;
    end: Nullable<CalendarDate>;
  },
  { range?: DateRange }
>) => {
  if (range) {
    start = range.start;
    end = range.end;
  }
  if (!start && !end) {
    return null;
  }
  return (
    <>
      <FormattedDate date={start} />
      &nbsp;&ndash;&nbsp;
      <FormattedDate date={end} />
    </>
  );
};

FormattedDateRange.orNull = (range: Nullable<DateRange>) =>
  !range || (!range.start && !range.end) ? null : (
    <FormattedDateRange range={range} />
  );

export const FormattedDateTime = memo(function FormattedDateTime({
  date,
}: {
  date: Nullable<DateTime>;
}) {
  date = asLuxonInstance(date, DateTime);

  const format = useDateTimeFormatter();
  return date ? (
    <Tooltip title={format(date, DateTime.DATETIME_HUGE)}>
      <time dateTime={date.toUTC().toISO()}>{format(date)}</time>
    </Tooltip>
  ) : null;
});

export const RelativeDateTime = memo(function RelativeDateTime({
  date,
}: {
  date: DateTime;
}) {
  date = asLuxonInstance(date, DateTime)!;

  const locale = useLocale();
  date = locale ? date.setLocale(locale) : date;
  const absoluteFormat = useDateTimeFormatter();
  const [now, setNow] = useState(() => DateTime.now());

  const diff = date.diff(now);

  const [formatted, delay] =
    Math.abs(diff.as('days')) > 1
      ? [absoluteFormat(date), undefined]
      : Math.abs(diff.as('hours')) > 1
      ? [date.toRelative(), 60_000] // 1 minute
      : Math.abs(diff.as('minutes')) > 1
      ? [date.toRelative(), 30_000] // 30 seconds
      : Math.abs(diff.as('seconds')) > 30
      ? [date.toRelative({ unit: 'minutes', padding: 30_000 }), 10_000]
      : diff.as('seconds') < -10
      ? ['a few seconds ago', 500]
      : diff.as('seconds') > 10
      ? ['in a few seconds', 500]
      : diff.as('seconds') > 0
      ? ['now', 500]
      : ['just now', 500];

  // Using RAF to avoid renders while in background
  useRafInterval(() => setNow(DateTime.now()), delay);

  return (
    <Tooltip title={absoluteFormat(date, DateTime.DATETIME_HUGE)}>
      <time dateTime={date.toUTC().toISO()}>{formatted}</time>
    </Tooltip>
  );
});

// Under some circumstances, the Apollo scalar read policy is ignored, causing
// this date to just be an ISO string.
// This is just a workaround, to try to prevent errors for users.
// https://github.com/apollographql/apollo-client/issues/9293
function asLuxonInstance(
  date: DateTime | null | undefined,
  cls: typeof DateTime
) {
  return !date
    ? null
    : cls.isDateTime(date)
    ? date
    : cls.fromISO(date as unknown as string);
}
