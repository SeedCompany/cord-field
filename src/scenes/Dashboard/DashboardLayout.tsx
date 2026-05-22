import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { ChildrenProp } from '~/common';

export const DashboardLayout = ({ children }: ChildrenProp) => (
  <Stack
    component="main"
    sx={{
      flex: 1,
      p: { xs: 1, mobile: 2 },
      mb: 2,
      gap: 2,
      overflowY: 'scroll',
      backgroundColor: 'background.default',
    }}
  >
    <Helmet title="My Dashboard" />
    {children}
  </Stack>
);
