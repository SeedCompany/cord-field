import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '~/components/Error';
import { WidgetGrid } from '~/components/Widgets/WidgetGrid';
import { DashboardLayout } from './DashboardLayout';
import { ProgressReportsExpanded } from './ProgressReportsWidget/ProgressReportsExpanded';
import { ProgressReportsWidget } from './ProgressReportsWidget/ProgressReportsWidget';

export const DashboardRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route index element={<MainDashboard />} />
      <Route path="/progress-reports" element={<ProgressReportsExpanded />} />
      {NotFoundRoute}
    </Routes>
  </DashboardLayout>
);

const MainDashboard = () => (
  <WidgetGrid>
    <ProgressReportsWidget />
    <Box />
  </WidgetGrid>
);
