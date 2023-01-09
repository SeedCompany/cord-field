import { Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { CalendarDate } from '~/common';

export const ReportDue = ({ date }: { date: CalendarDate }) => {
  const past = date <= DateTime.now();

  return (
    <>
      <Typography
        component="span"
        variant="body2"
        color={past ? `error.dark` : `info.light`}
      >
        due {date.toRelative()}
      </Typography>

      <Typography component="span" variant="body2" color="text.primary" ml={1}>
        {date.toLocaleString(DateTime.DATE_MED)}
      </Typography>
    </>
  );
};
