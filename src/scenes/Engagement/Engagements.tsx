import loadable from '@loadable/component';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { Engagement } from './Engagement';

const Products = loadable(() => import('../Products'), {
  resolveComponent: (m) => m.Products,
});
const ProgressReports = loadable(() => import('./ProgressReports'), {
  resolveComponent: (m) => m.ProgressReports,
});

export const Engagements = () => (
  <Routes>
    <Route path="" element={<Engagement />} />
    <Route path="products/*" element={<Products />} />
    <Route path="reports/progress/*" element={<ProgressReports />} />
    {NotFoundRoute}
  </Routes>
);
