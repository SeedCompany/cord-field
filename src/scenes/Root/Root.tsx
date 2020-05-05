import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Authentication } from '../Authentication';
import { DevTest } from '../DevTest';
import { Home } from '../Home';
import { Organizations } from '../Organizations';

const useStyles = makeStyles(() => ({
  // Use @global basically never
  '@global': {
    '#root': {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
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
    </Routes>
  );

  return <Authentication>{routes}</Authentication>;
};
