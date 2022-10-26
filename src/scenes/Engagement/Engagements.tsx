import loadable from '@loadable/component';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { splicePath } from '~/common';
import { ChangesetContext } from '~/components/Changeset';
import { NotFoundRoute } from '../../components/Error';
import { Navigate } from '../../components/Routing';
import { Engagement } from './Engagement';

const CreateProduct = loadable(() => import('../Products'), {
  resolveComponent: (m) => m.CreateProduct,
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
      <Route path="products/create" element={<CreateProduct />} />
      <Route path="products/*" element={<OldProducts />} />
      <Route path="reports/progress" element={<ProgressReportsList />} />
      <Route
        path="reports/progress/:reportId"
        element={<OldProgressReportDetail />}
      />
      {NotFoundRoute}
    </Routes>
  </ChangesetContext>
);

const OldProducts = () => (
  <Navigate replace permanent to={splicePath(useLocation(), 1, 2)} />
);

const OldProgressReportDetail = () => {
  const { reportId = '' } = useParams();
  return <Navigate replace permanent to={`/progress-reports/${reportId}`} />;
};
