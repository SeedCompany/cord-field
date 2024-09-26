import { Box, Card, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { ChildrenProp } from '~/common';

export const DashboardLayout = ({ children }: ChildrenProp) => (
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
    {children}
  </Box>
);
