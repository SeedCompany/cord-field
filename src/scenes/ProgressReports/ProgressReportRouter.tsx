import { Route, Routes } from 'react-router-dom';
import { ChangesetContext } from '../../components/Changeset';
import { NotFoundRoute } from '../../components/Error';
import { ProgressReportDetail as ProgressReport } from './Detail';

export const ProgressReportRouter = () => (
  <Routes>
    <Route path=":reportId/*" element={<Detail />} />
    {NotFoundRoute}
  </Routes>
);

const Detail = () => (
  <ChangesetContext>
    <Routes>
      <Route path="*" element={<ProgressReport />} />
    </Routes>
  </ChangesetContext>
);
