import { Box, Card, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { DashboardLayout } from '~/components/DashboardLayout';
import { TableWidget } from '~/components/Widgets/TableWidget';
import { widgetConfigs } from '~/components/Widgets/widgetConfig';

export const MyDashboard = () => {
  return (
    <Box
      component="main"
      sx={{ height: 1, p: 2, display: 'flex', flexDirection: 'column' }}
    >
      <Helmet title="My Dashboard" />

      <Card sx={{ backgroundColor: '#A6DBC7', p: 4, mb: 2 }} elevation={0}>
        <Typography variant="h3">My Dashboard</Typography>
      </Card>

      <DashboardLayout gap={2}>
        {widgetConfigs.map((config) => {
          const WidgetComponent =
            config.type === 'TableWidget' ? TableWidget : null;
          return WidgetComponent && <WidgetComponent {...config} />;
        })}
      </DashboardLayout>
    </Box>
  );
};
