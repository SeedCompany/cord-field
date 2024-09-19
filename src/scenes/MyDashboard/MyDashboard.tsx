import { Box, Card, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '~/components/DashboardLayout';
import { NotFoundRoute } from '~/components/Error';

const widgets: ReactElement[] = [];

export const MyDashboard = () => (
  <Box
    component="main"
    sx={{
      height: 1,
      p: 2,
      mb: 2,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'scroll',
    }}
  >
    <Helmet title="My Dashboard" />

    <Card
      sx={{ backgroundColor: '#A6DBC7', p: 4, mb: 2, overflow: 'unset' }}
      elevation={0}
    >
      <Typography variant="h3">My Dashboard</Typography>
    </Card>
    <Routes>
      <Route path="" element={<DashboardLayout>{widgets}</DashboardLayout>} />
      {NotFoundRoute}
    </Routes>
  </Box>
);
