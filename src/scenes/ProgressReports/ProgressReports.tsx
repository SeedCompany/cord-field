import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ChangesetContext } from '../../components/Changeset';
import { NotFoundRoute } from '../../components/Error';
import { ProgressReportDetail as ProgressReport } from './Detail';
import { OtherFilesList } from './OtherFiles/List';

export const ProgressReports = () => (
  <Routes>
    <Route path=":reportId/*" element={<Detail />} />
    {NotFoundRoute}
  </Routes>
);

const Detail = () => (
  <ChangesetContext>
    <Routes>
      <Route path="" element={<ProgressReport />} />
      +<Route path="files" element={<OtherFilesList />} />
      {NotFoundRoute}
    </Routes>
  </ChangesetContext>
);
