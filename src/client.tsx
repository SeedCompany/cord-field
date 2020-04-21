import { loadableReady } from '@loadable/component';
import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { Nest } from './components/Nest';
import { ServerDataProvider } from './components/ServerData';

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
      await import('./util/CalenderDate')
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
];

const render = (TheApp: ComponentType) => {
  void Promise.all(setup).then(() => {
    ReactDOM.hydrate(
      <Nest elements={clientOnlyProviders}>
        <TheApp />
      </Nest>,
      root,
      () => {
        const jssStyles = document.getElementById('jss-ssr');
        jssStyles?.parentNode?.removeChild(jssStyles);
      }
    );
  });
};

// Blur auto-focused elements on app start as MUI doesn't boot state correctly
(document.activeElement as any)?.blur();

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
    render(require('./App').App);
  });
}
