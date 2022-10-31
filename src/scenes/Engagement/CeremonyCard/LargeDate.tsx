import { Box, Skeleton, Typography } from '@mui/material';
import { useState } from 'react';
import { CalendarDate, Nullable, SecuredProp } from '~/common';
import { useDateFormatter } from '../../../components/Formatters';
import { Redacted } from '../../../components/Redacted';

const skeleton = {
  borderRadius: 'inherit',
  height: 'initial',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

interface LargeDateProps {
  date?: Nullable<SecuredProp<CalendarDate>>;
  className?: string;
}

export const LargeDate = ({ date, className }: LargeDateProps) => {
  const formatDate = useDateFormatter();
  const [placeholderNow] = useState(() => CalendarDate.local());

  return (
    <Typography
      color="primary"
      variant="h2"
      className={className}
      sx={[
        {
          p: 2,
          borderRadius: 100,
          position: 'relative',
        },
        !date || !date.canRead ? null : { bgcolor: 'grey.300' },
      ]}
    >
      {date?.value ? (
        formatDate(date.value)
      ) : (
        <>
          <Box component="span" sx={{ visibility: 'hidden' }}>
            {formatDate(placeholderNow)}
          </Box>
          {!date ? (
            <Skeleton variant="rectangular" sx={skeleton} />
          ) : !date.canRead ? (
            <Redacted
              info="You don't have permission to view this date"
              SkeletonProps={{
                variant: 'rectangular',
                sx: [skeleton, { bgcolor: 'grey.700' }],
              }}
            />
          ) : null}
        </>
      )}
    </Typography>
  );
};
