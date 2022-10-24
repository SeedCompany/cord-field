import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { ProgressReportDetail as ProgressReport } from './Detail';

export const ProgressReports = () => (
  <Routes>
    <Route path=":reportId/*" element={<Detail />} />
    {NotFoundRoute}
  </Routes>
);

const Detail = () => (
  // <ChangesetContext>
  <Routes>
    <Route path="" element={<ProgressReport />} />
    {NotFoundRoute}
  </Routes>
  // </ChangesetContext>
);
