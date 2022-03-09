import loadable from '@loadable/component';
import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { ChangesetContext } from '../../components/Changeset';
import { NotFoundRoute } from '../../components/Error';
import { Navigate } from '../../components/Routing';
import { Engagement } from './Engagement';

const Products = loadable(() => import('../Products'), {
  resolveComponent: (m) => m.Products,
});
const ProgressReportsList = loadable(() => import('../ProgressReports'), {
  resolveComponent: (m) => m.ProgressReportsList,
});

export const Engagements = () => (
  <Routes>
    <Route path=":engagementId/*" element={<EngagementDetail />} />
    {NotFoundRoute}
  </Routes>
);

const EngagementDetail = () => (
  <ChangesetContext>
    <Routes>
      <Route path="" element={<Engagement />} />
      <Route path="products/*" element={<Products />} />
      <Route path="reports/progress" element={<ProgressReportsList />} />
      <Route
        path="reports/progress/:reportId"
        element={<OldProgressReportDetail />}
      />
      {NotFoundRoute}
    </Routes>
  </ChangesetContext>
);

const OldProgressReportDetail = () => {
  const { reportId = '' } = useParams();
  return <Navigate replace to={`/progress-reports/${reportId}`} />;
};
