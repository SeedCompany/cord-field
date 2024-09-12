import { Box, Card, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { DashboardLayout } from '~/components/DashboardLayout';
import { widgetConfigs } from '~/components/Widgets/widgetConfig';

export const MyDashboard = () => {
  return (
    <Box
      component="main"
      sx={{
        height: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
      }}
    >
      <Helmet title="My Dashboard" />

      <Card
        sx={{ backgroundColor: '#A6DBC7', p: 4, mb: 2, display: 'table' }}
        elevation={0}
      >
        <Typography variant="h3">My Dashboard</Typography>
      </Card>

      <DashboardLayout gap={2}>
        {widgetConfigs.map((Comp, i) => {
          return <Comp key={i} />;
        })}
      </DashboardLayout>
    </Box>
  );
};
