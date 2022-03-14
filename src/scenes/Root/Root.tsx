import loadable from '@loadable/component';
import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { useIdentifyInLogRocket } from '../../components/Session';
import { Authentication } from '../Authentication';
import { Home } from '../Home';
import { AppMetadata } from './AppMetadata';
import { CreateDialogProviders } from './Creates';
import { CssBaseline } from './CssBaseline';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useNonProdWarning } from './useNonProdWarning';

const Partners = loadable(() => import('../Partners'), {
  resolveComponent: (m) => m.Partners,
});
const Projects = loadable(() => import('../Projects'), {
  resolveComponent: (m) => m.Projects,
});
const Engagements = loadable(() => import('../Engagement'), {
  resolveComponent: (m) => m.Engagements,
});
const Products = loadable(() => import('../Products'), {
  resolveComponent: (m) => m.Products,
});
const ProgressReports = loadable(() => import('../ProgressReports'), {
  resolveComponent: (m) => m.ProgressReports,
});
const Languages = loadable(() => import('../Languages'), {
  resolveComponent: (m) => m.Languages,
});
const Users = loadable(() => import('../Users'), {
  resolveComponent: (m) => m.Users,
});
const Locations = loadable(() => import('../Locations/Locations'), {
  resolveComponent: (m) => m.Locations,
});
const SearchResults = loadable(() => import('../SearchResults'), {
  resolveComponent: (m) => m.SearchResults,
});

const useStyles = makeStyles(() => ({
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
  useNonProdWarning();
  useIdentifyInLogRocket();

  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/partners/*" element={<Partners />} />
      <Route path="/projects/*" element={<Projects />} />
      <Route path="/engagements/*" element={<Engagements />} />
      <Route path="/products/*" element={<Products />} />
      <Route path="/progress-reports/*" element={<ProgressReports />} />
      <Route path="/languages/*" element={<Languages />} />
      <Route path="/users/*" element={<Users />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/locations/*" element={<Locations />} />
      {NotFoundRoute}
    </Routes>
  );

  return (
    <>
      <CssBaseline />
      <AppMetadata />
      <Authentication>
        <div className={classes.app}>
          <CreateDialogProviders>
            <Sidebar />
          </CreateDialogProviders>
          <div className={classes.main}>
            <Header />
            {routes}
          </div>
        </div>
      </Authentication>
    </>
  );
};
