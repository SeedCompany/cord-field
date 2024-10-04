import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { StyleProps } from '~/common';

export interface WidgetHeaderProps extends StyleProps {
  title: ReactNode;
  subTitle?: ReactNode;
  children?: ReactNode;
  expandAction?: ReactNode;
}

export const WidgetHeader = ({
  title,
  subTitle,
  children,
  expandAction,
  ...rest
}: WidgetHeaderProps) => (
  <Box display="flex" alignItems="center" p={2} gap={2} {...rest}>
    <Stack>
      <Typography variant="h4">{title}</Typography>
      {subTitle && (
        <Typography variant="caption" color="text.secondary">
          {subTitle}
        </Typography>
      )}
    </Stack>
    {children}
    {expandAction && (
      <Box flex={1} m={-1} display="flex" flexDirection="row-reverse">
        {expandAction}
      </Box>
    )}
  </Box>
);
