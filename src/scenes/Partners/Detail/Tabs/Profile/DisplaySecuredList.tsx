import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { SecuredProp, StyleProps } from '~/common';
import { Redacted, RedactedProps } from '~/components/Redacted';

export const DisplaySecuredList = <T extends string>({
  title,
  data,
  labelBy,
  redacted,
  ...rest
}: {
  title: ReactNode;
  data?: SecuredProp<readonly T[]>;
  labelBy: (value: T) => ReactNode;
  redacted?: Partial<RedactedProps> & { fieldDescription?: string };
} & StyleProps) => (
  <Box {...rest}>
    <Typography
      component="h4"
      variant="body2"
      color="textSecondary"
      gutterBottom
    >
      {title}
    </Typography>
    {!data ? (
      <Skeleton width="75%" />
    ) : data.canRead ? (
      data.value && data.value.length > 0 ? (
        <Stack component="ul" sx={{ m: 0, p: 0, gap: 1 }}>
          {data.value.map((type) => (
            <Typography
              component="li"
              variant="h4"
              sx={{ listStyleType: 'none' }}
              key={type}
            >
              {labelBy(type)}
            </Typography>
          ))}
        </Stack>
      ) : (
        <Typography component="p" variant="h4">
          None
        </Typography>
      )
    ) : (
      <Redacted
        info={
          redacted?.fieldDescription
            ? `You don't have permission to view the ${redacted.fieldDescription}`
            : `You don't have permission to view this`
        }
        width="100%"
        {...redacted}
      />
    )}
  </Box>
);
