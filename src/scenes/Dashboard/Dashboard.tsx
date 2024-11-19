import { Stack } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '~/components/Error';
import { WidgetGrid } from '~/components/Widgets/WidgetGrid';
import { DashboardLayout } from './DashboardLayout';
import { PnpErrorsWidget } from './PnpErrorsWidget/PnpErrorsWidget';
import { ProgressReportsWidget } from './ProgressReportsWidget/ProgressReportsWidget';

export const DashboardRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route index element={<MainDashboard />} />
      <Route path="/progress-reports" element={<ExpandedProgressReports />} />
      <Route path="/pnp-errors" element={<ExpandedPnpErrors />} />
      {NotFoundRoute}
    </Routes>
  </DashboardLayout>
);

const MainDashboard = () => (
  <WidgetGrid>
    <ProgressReportsWidget colSpan={8} rowSpan={6} expanded={false} />
    <PnpErrorsWidget colSpan={8} rowSpan={6} expanded={false} />
  </WidgetGrid>
);

const ExpandedProgressReports = () => (
  <Stack sx={{ flex: 1 }}>
    <ProgressReportsWidget
      colSpan={12}
      rowSpan={12}
      expanded
      sx={{ flex: 1 }}
    />
  </Stack>
);

const ExpandedPnpErrors = () => (
  <Stack sx={{ flex: 1 }}>
    <PnpErrorsWidget colSpan={12} rowSpan={12} expanded sx={{ flex: 1 }} />
  </Stack>
);
