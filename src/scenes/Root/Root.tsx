import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Authentication } from '../Authentication';
import { Home } from '../Home';
import { Languages } from '../Languages';
import { Partners } from '../Partners';
import { Projects } from '../Projects';
import { SearchResults } from '../SearchResults';
import { Users } from '../Users';
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
      <Route path="/partners/*" element={<Partners />} />
      <Route path="/projects/*" element={<Projects />} />
      <Route path="/languages/*" element={<Languages />} />
      <Route path="/users/*" element={<Users />} />
      <Route path="/search" element={<SearchResults />} />
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
