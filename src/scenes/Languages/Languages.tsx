import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { LanguageDetail } from './Detail';
import { LanguageList } from './List';

export const Languages = () => (
  <Routes>
    <Route path="" element={<LanguageList />} />
    <Route path=":languageId" element={<LanguageDetail />} />
    {NotFoundRoute}
  </Routes>
);
