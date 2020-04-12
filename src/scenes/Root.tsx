import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DevTest } from './DevTest';
import { Home } from './Home';

export const Root = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/devtest" element={<DevTest />} />
  </Routes>
);
