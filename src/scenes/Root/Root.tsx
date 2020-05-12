import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Authentication } from '../Authentication';
import { DevTest } from '../DevTest';
import { Home } from '../Home';
import { Organizations } from '../Organizations';
import { Projects } from '../Projects';
import { Sidebar } from './Sidebar';

const useStyles = makeStyles(() => ({
  // Use @global basically never
  '@global': {
    '#root': {
      height: '100vh',
      display: 'flex',
    },
  },
}));

export const Root = () => {
  useStyles();
  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/devtest" element={<DevTest />} />
      <Route path="/organizations/*" element={<Organizations />} />
      <Route path="/projects/*" element={<Projects />} />
    </Routes>
  );

  return (
    <Authentication>
      <Sidebar />
      {routes}
    </Authentication>
  );
};
