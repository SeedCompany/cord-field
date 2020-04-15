import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Authentication } from './Authentication';
import { DevTest } from './DevTest';
import { Home } from './Home';

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
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/*" element={<Authentication />} />
      <Route path="/devtest" element={<DevTest />} />
    </Routes>
  );
};
