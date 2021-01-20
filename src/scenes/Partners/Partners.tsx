import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { PartnerDetail } from './Detail';
import { PartnerList } from './List';

export const Partners = () => (
  <Routes>
    <Route path="" element={<PartnerList />} />
    <Route path=":partnerId" element={<PartnerDetail />} />
    {NotFoundRoute}
  </Routes>
);
