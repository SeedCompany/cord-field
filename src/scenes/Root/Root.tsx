import loadable from '@loadable/component';
import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { Authentication } from '../Authentication';
import { Home } from '../Home';
import { CreateDialogProviders } from './Creates';
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
  useNonProdWarning();

  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/partners/*" element={<Partners />} />
      <Route path="/projects/*" element={<Projects />} />
      <Route path="/engagements/*" element={<Engagements />} />
      <Route path="/languages/*" element={<Languages />} />
      <Route path="/users/*" element={<Users />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/locations/*" element={<Locations />} />
      {NotFoundRoute}
    </Routes>
  );

  return (
    <>
      <Helmet titleTemplate="%s - CORD Field" defaultTitle="CORD Field">
        <html lang="en" />
        <meta charSet="utf-8" />
        <base href="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* sofia-pro font */}
        <link href="https://use.typekit.net/qrd6jxb.css" rel="stylesheet" />

        {/* Search in browser bar */}
        {process.env.RAZZLE_OPEN_SEARCH === 'true' && (
          <link
            type="application/opensearchdescription+xml"
            rel="search"
            href={`${PUBLIC_URL}/opensearch.xml`}
          />
        )}

        {/* Polyfill for IntersectionObserver, ResizeObserver, AbortController */}
        <script
          crossOrigin="anonymous"
          src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserverEntry%2CIntersectionObserver%2CResizeObserver%2CAbortController"
        />
      </Helmet>
      <FavIcons />
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

const { PUBLIC_URL = '' } = process.env;

const FavIcons = () => (
  <Helmet>
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href={`${PUBLIC_URL}/images/apple-touch-icon.png`}
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href={`${PUBLIC_URL}/images/favicon-32x32.png`}
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href={`${PUBLIC_URL}/images/favicon-16x16.png`}
    />
    <link rel="manifest" href={`${PUBLIC_URL}/site.webmanifest`} />
    <link
      rel="mask-icon"
      href={`${PUBLIC_URL}/images/safari-pinned-tab.svg`}
      color="#64b145"
    />
    <link rel="shortcut icon" href={`${PUBLIC_URL}/images/favicon.ico`} />
    <meta name="apple-mobile-web-app-title" content="CORD Field" />
    <meta name="application-name" content="CORD Field" />
    <meta name="msapplication-TileColor" content="#64b145" />
    <meta
      name="msapplication-config"
      content={`${PUBLIC_URL}/browserconfig.xml`}
    />
    <meta name="theme-color" content="#ffffff" />
  </Helmet>
);
