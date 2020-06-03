import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Authentication } from '../Authentication';
import { Home } from '../Home';
import { Languages } from '../Languages';
import { Organizations } from '../Organizations';
import { Projects } from '../Projects';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const useStyles = makeStyles(() => ({
  // Use @global basically never
  '@global': {
    '#root': {
      minHeight: '100vh',
      display: 'flex',
    },
  },
  app: {
    flex: 1,
    display: 'flex',
    height: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const Root = () => {
  const classes = useStyles();
  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/organizations/*" element={<Organizations />} />
      <Route path="/projects/*" element={<Projects />} />
      <Route path="/languages/*" element={<Languages />} />
    </Routes>
  );

  return (
    <Authentication>
      <div className={classes.app}>
        <Sidebar />
        <div className={classes.main}>
          <Header />
          {routes}
        </div>
      </div>
    </Authentication>
  );
};
