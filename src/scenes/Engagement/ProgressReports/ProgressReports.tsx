import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../../components/Error';
import { ProgressReportDetail } from './Detail';
import { ProgressReportsList } from './List';

export const ProgressReports = () => (
  <Routes>
    <Route path="" element={<ProgressReportsList />} />
    <Route path=":progressReportId" element={<ProgressReportDetail />} />
    {NotFoundRoute}
  </Routes>
);
