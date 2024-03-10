import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { SecuredProp, StyleProps } from '~/common';
import { Redacted, RedactedProps } from '../Redacted';

interface DataItem {
  [key: string]: any;
}

interface DisplaySecuredListProps<T> {
  title: ReactNode;
  data?: SecuredProp<readonly T[]>;
  keyGetter?: (item: T) => string;
  redacted?: Partial<RedactedProps> & { fieldDescription?: string };
}

export const DisplaySecuredList = <T extends DataItem | string>({
  title,
  data,
  keyGetter,
  redacted,
  ...rest
}: DisplaySecuredListProps<T> & StyleProps) => (
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
          {data.value.map((item, index) => {
            let label;
            if (typeof item === 'string') {
              label = item;
            } else if (keyGetter === undefined) {
              throw new Error(
                'keyGetter function must be provided when data is of object type'
              );
            } else {
              label = keyGetter(item);
            }
            return (
              <Typography
                component="li"
                variant="h4"
                sx={{ listStyleType: 'none' }}
                key={index} // index use as key
              >
                {label}
              </Typography>
            );
          })}
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
