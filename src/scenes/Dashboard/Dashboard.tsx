import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '~/components/Error';
import { WidgetGrid } from '~/components/Widgets/WidgetGrid';
import { DashboardLayout } from './DashboardLayout';

export const DashboardRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="" element={<MainDashboard />} />
      {NotFoundRoute}
    </Routes>
  </DashboardLayout>
);

const MainDashboard = () => {
  return (
    <WidgetGrid>
      <Box />
      <Box />
    </WidgetGrid>
  );
};
