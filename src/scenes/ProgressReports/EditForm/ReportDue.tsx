import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DateTime } from 'luxon';
import { CalendarDate } from '~/common';

export const ReportDue = ({ date }: { date: CalendarDate }) => {
  const theme = useTheme();

  const past = date <= DateTime.now();

  return (
    <>
      <Typography
        component="span"
        variant="body2"
        color={
          past
            ? `error.${theme.palette.mode === 'light' ? 'dark' : 'light'}`
            : `info.${theme.palette.mode}`
        }
      >
        due {date.toRelative()}
      </Typography>

      <Typography component="span" variant="body2" color="text.primary" ml={1}>
        {date.toLocaleString(DateTime.DATE_MED)}
      </Typography>
    </>
  );
};
