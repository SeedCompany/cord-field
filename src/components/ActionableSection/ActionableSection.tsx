import { Box, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { ChildrenProp, StyleProps } from '~/common';

interface ActionableSectionProps extends StyleProps, ChildrenProp {
  title?: ReactNode;
  action?: ReactNode;
  loading?: boolean;
}

export const ActionableSection = ({
  loading,
  title,
  action,
  children,
  ...rest
}: ActionableSectionProps) => (
  <Box component="section" {...rest}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1,
      }}
    >
      <Typography variant="h3">
        {!loading ? title : <Skeleton width="120px" />}
      </Typography>
      {action}
    </Box>
    <Divider />
    <Stack p={2}>{children}</Stack>
  </Box>
);
