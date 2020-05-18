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
      height: '100vh',
      display: 'flex',
    },
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
      <Sidebar />
      <div className={classes.main}>
        <Header />
        {routes}
      </div>
    </Authentication>
  );
};
