import { loadableReady } from '@loadable/component';
import Cookies from 'js-cookie';
import { Settings } from 'luxon';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from './api';
import { App } from './App';
import { Nest } from './components/Nest';
import { ServerDataProvider } from './components/ServerData';
import { SnackbarProvider } from './components/Snackbar';

// Set current timezone in cookie so server can render with it.
// This isn't great as a change to this or first load will cause the server to
// render the timezone incorrectly. This will only be fixed once client side
// code loads and replaces it or on next load from server.
if (
  typeof window !== 'undefined' &&
  Cookies.get().tz !== Settings.defaultZoneName
) {
  Cookies.set('tz', Settings.defaultZoneName);
}

const setup: Array<Promise<any>> = [];
const isBrowser = typeof window !== 'undefined';

if (process.env.NODE_ENV !== 'production') {
  const devSetUp = async () => {
    if (!isBrowser) {
      return;
    }
    // Add lodash, temporal objs to dev console
    Object.assign(
      window,
      await import('lodash').then((_) => ({ _ })),
      await import('luxon'),
      await import('./util/CalenderDate'),
      await import('js-cookie').then((Cookies) => ({ Cookies }))
    );
    // Do hacking to show dates easier
    await import('./util/hacky-inspect-dates');

    const whyDidYouRender = await import(
      '@welldone-software/why-did-you-render'
    );
    whyDidYouRender.default(React);
  };
  setup.push(devSetUp());
}

if (isBrowser) {
  setup.push(loadableReady());
}

const root = document.getElementById('root');
const serverData = (window as any).__SERVER_DATA__;

const clientOnlyProviders = [
  <ServerDataProvider value={serverData} />,
  <BrowserRouter />,
  <HelmetProvider children={<></>} />,
  <SnackbarProvider />, // needed by apollo
  <ApolloProvider />,
];

// Blur auto-focused elements on app start as MUI doesn't boot state correctly
(document.activeElement as any)?.blur();

void Promise.all(setup).then(() => {
  ReactDOM.hydrate(
    <Nest elements={clientOnlyProviders}>
      <App />
    </Nest>,
    root,
    () => {
      const jssStyles = document.getElementById('jss-ssr');
      jssStyles?.parentNode?.removeChild(jssStyles);
    }
  );
});
