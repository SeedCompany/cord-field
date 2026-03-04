import { Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { ChildrenProp } from '~/common';

export const DashboardLayout = ({ children }: ChildrenProp) => (
  <Stack
    component="main"
    sx={{
      flex: 1,
      p: 2,
      mb: 2,
      gap: 2,
      overflowY: 'scroll',
      backgroundColor: 'background.default',
    }}
  >
    <Helmet title="My Dashboard" />

    <Typography
      component="h1"
      variant="h3"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : theme.palette.background.lightBlue,
        color: 'text.primary',
        p: 4,
        borderRadius: 1,
      }}
    >
      My Dashboard
    </Typography>

    {children}
  </Stack>
);
