import { Tooltip } from '@material-ui/core';
import { DateTime, DateTimeFormatOptions } from 'luxon';
import * as React from 'react';
import { CalendarDate, Nullable } from '../../util';
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
}: {
  start: Nullable<CalendarDate>;
  end: Nullable<CalendarDate>;
}) => {
  if (!start && !end) {
    return null;
  }
  return (
    <>
      <FormattedDate date={start} />
      &nbsp;-&nbsp;
      <FormattedDate date={end} />
    </>
  );
};

export const FormattedDateTime = ({ date }: { date: Nullable<DateTime> }) => {
  const format = useDateTimeFormatter();
  return date ? (
    <Tooltip title={format(date, DateTime.DATETIME_HUGE)}>
      <time dateTime={date.toUTC().toISO()}>{format(date)}</time>
    </Tooltip>
  ) : null;
};
