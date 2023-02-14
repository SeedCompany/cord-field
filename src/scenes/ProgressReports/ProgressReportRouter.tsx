import { Route, Routes } from 'react-router-dom';
import { ChangesetContext } from '../../components/Changeset';
import { NotFoundRoute } from '../../components/Error';
import { ProgressReportDetail as ProgressReport } from './Detail';
import { StatusHistory } from './StatusHistory';

export const ProgressReportRouter = () => (
  <Routes>
    <Route path=":reportId/workflow-history" element={<StatusHistory />} />
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
