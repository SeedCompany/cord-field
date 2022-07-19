import { loadableReady } from '@loadable/component';
import Cookies from 'js-cookie';
import { Settings, Zone } from 'luxon';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { hydrate } from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { basePathOfUrl } from '~/common';
import { App } from './App';
import { Nest } from './components/Nest';

// Set current timezone in cookie so server can render with it.
// This isn't great as a change to this or first load will cause the server to
// render the timezone incorrectly. This will only be fixed once client side
// code loads and replaces it or on next load from server.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const defaultZone = (Settings.defaultZone as Zone).name;
if (typeof window !== 'undefined' && Cookies.get().tz !== defaultZone) {
  Cookies.set('tz', defaultZone);
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
      await import('./common/CalenderDate'),
      await import('js-cookie').then((Cookies) => ({ Cookies }))
    );
    // Do hacking to show dates easier
    await import('./common/hacky-inspect-dates');

    // Setup why did you render
    const [React, whyDidYouRender] = await Promise.all([
      import('react').then((m) => m.default),
      import('@welldone-software/why-did-you-render').then((m) => m.default),
    ]);
    whyDidYouRender(React, {
      // ...WDYR options
    });
  };
  setup.push(devSetUp());
}

if (isBrowser) {
  setup.push(loadableReady());
}

const root = document.getElementById('root');

const clientOnlyProviders = [
  <BrowserRouter
    key="router"
    basename={basePathOfUrl(process.env.PUBLIC_URL)}
  />,
  <HelmetProvider key="helmet" children={[]} />,
  <DndProvider key="dnd" backend={HTML5Backend} />,
];

void Promise.all(setup).then(() => {
  hydrate(
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
