import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DevTest } from './DevTest';
import { Home } from './Home';
import { Login } from './Login';

export const Root = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/devtest" element={<DevTest />} />
  </Routes>
);
