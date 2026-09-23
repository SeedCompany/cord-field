import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { GtlReportDetail } from './Detail/GtlReportDetail';

export const GtlReportRouter = () => (
  <Routes>
    <Route path=":reportId/*" element={<GtlReportDetail />} />
    {NotFoundRoute}
  </Routes>
);
