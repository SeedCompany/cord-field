import { CacheProvider } from '@emotion/react';
import { loadableReady } from '@loadable/component';
import Cookies from 'js-cookie';
import { Settings, Zone } from 'luxon';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { TssCacheProvider } from 'tss-react';
import { basePathOfUrl } from '~/common';
import { App } from './App';
import { Nest } from './components/Nest';
import { createMuiEmotionCache, createTssEmotionCache } from './theme/emotion';

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
      await import('./common').then((common) => ({ common })),
      await import('js-cookie').then((Cookies) => ({ Cookies }))
    );
    // Do hacking to show dates easier
    await import('./common/hacky-inspect-dates');
  };
  setup.push(devSetUp());
}

if (isBrowser) {
  setup.push(loadableReady());
}

const root = document.getElementById('root')!;

const emotionCacheMui = createMuiEmotionCache();
const emotionCacheTss = createTssEmotionCache();

const clientOnlyProviders = [
  <BrowserRouter
    key="router"
    basename={basePathOfUrl(process.env.PUBLIC_URL)}
  />,
  <HelmetProvider key="helmet" children={[]} />,
  <DndProvider key="dnd" backend={HTML5Backend} />,
  <CacheProvider key="emotion-mui" value={emotionCacheMui} />,
  <TssCacheProvider key="emotion-tss" value={emotionCacheTss} children={[]} />,
];

void Promise.all(setup).then(() => {
  createRoot(root).render(
    <Nest elements={clientOnlyProviders}>
      <App />
    </Nest>
  );
});
