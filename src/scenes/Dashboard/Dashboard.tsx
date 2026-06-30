import { Stack } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '~/components/Error';
import { WidgetGrid } from '~/components/Widgets/WidgetGrid';
import { DashboardLayout } from './DashboardLayout';
import { PnpProblemsWidget } from './PnpProblemsWidget/PnpProblemsWidget';
import { ProgressReportsWidget } from './ProgressReportsWidget/ProgressReportsWidget';

export const DashboardRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route index element={<MainDashboard />} />
      <Route path="/progress-reports" element={<ExpandedProgressReports />} />
      <Route path="/pnp-errors" element={<ExpandedPnpProblems />} />
      {NotFoundRoute}
    </Routes>
  </DashboardLayout>
);

const MainDashboard = () => (
  <WidgetGrid>
    <ProgressReportsWidget colSpan={8} rowSpan={6} expanded={false} />
    <PnpProblemsWidget colSpan={8} rowSpan={6} expanded={false} />
  </WidgetGrid>
);

// `minHeight: 0` lets the widget shrink to the available height (instead of its
// default `min-height: auto` growing to content). That gives the widget — and so
// its `containerType: size` table — a definite size, the same way the compact
// grid cell does, so the expanded DataGrid scrolls internally (left/right and
// up/down) rather than overflowing.
const ExpandedProgressReports = () => (
  <Stack sx={{ flex: 1, minHeight: 0 }}>
    <ProgressReportsWidget
      colSpan={12}
      rowSpan={12}
      expanded
      sx={{ flex: 1, minHeight: 0 }}
    />
  </Stack>
);

const ExpandedPnpProblems = () => (
  <Stack sx={{ flex: 1, minHeight: 0 }}>
    <PnpProblemsWidget
      colSpan={12}
      rowSpan={12}
      expanded
      sx={{ flex: 1, minHeight: 0 }}
    />
  </Stack>
);
