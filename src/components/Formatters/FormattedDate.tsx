import { Tooltip } from '@mui/material';
import { DateTime, DateTimeFormatOptions } from 'luxon';
import { MergeExclusive } from 'type-fest';
import { DateRange } from '~/api/schema.graphql';
import { CalendarDate, Nullable } from '~/common';
import { useDateFormatter, useDateTimeFormatter } from './useDateFormatter';

export const FormattedDate = ({
  date,
  displayOptions,
}: {
  date: Nullable<CalendarDate>;
  displayOptions?: DateTimeFormatOptions;
}) => {
  const format = useDateFormatter();
  return date ? (
    <Tooltip title={format(date, DateTime.DATE_HUGE)}>
      <time dateTime={date.toISODate()}>{format(date, displayOptions)}</time>
    </Tooltip>
  ) : null;
};

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

export const FormattedDateTime = ({
  date,
  relative,
}: {
  date: Nullable<DateTime>;
  relative?: boolean;
}) => {
  const format = useDateTimeFormatter();
  // ToDo: when using relative, we should update using a defined interval
  return date ? (
    <Tooltip title={format(date, DateTime.DATETIME_HUGE)}>
      <time dateTime={date.toUTC().toISO()}>
        {relative ? date.toRelative() : format(date)}
      </time>
    </Tooltip>
  ) : null;
};
