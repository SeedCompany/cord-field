import { ApolloClient, ApolloProvider } from '@apollo/client';
import { getMarkupFromTree } from '@apollo/client/react/ssr';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionServer, {
  EmotionServer,
} from '@emotion/server/create-instance';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { pickBy } from 'lodash';
import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { TssCacheProvider } from 'tss-react';
import { createClient } from '~/api/client/createClient';
import { ErrorCache } from '~/api/client/links/errorCache.link';
import { basePathOfUrl, trailingSlash } from '~/common';
import {
  ChunkCollector,
  hasPendingLoadables,
  whenLoadablesSettle,
} from '~/components/Loadable';
import {
  Impersonation,
  impersonationFromCookie,
  ImpersonationProvider,
} from '../api/client/ImpersonationContext';
import { App } from '../App';
import { Nest } from '../components/Nest';
import { ServerLocation } from '../components/Routing';
import { RequestContext } from '../hooks';
import { createMuiEmotionCache, createTssEmotionCache } from '../theme/emotion';
import { renderAssets } from './assets';
import { indexHtml } from './indexHtml';

const basePath = basePathOfUrl(process.env.PUBLIC_URL);

/**
 * How many times to settle-then-render before giving up and shipping markup
 * that may contain a fallback. In steady state the loop runs exactly once.
 */
const MAX_RENDER_PASSES = 3;

export const renderServerSideApp = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const impersonation = impersonationFromCookie(req.cookies);
  const errorCache: ErrorCache = {};
  const apollo = createClient({
    ssr: { req, res },
    errorCache,
    impersonation: { current: impersonation },
  });

  const helmetContext: Partial<FilledContext> = {};

  const ssrStyles = new SsrStyles();

  const location = new ServerLocation();

  const collector = new ChunkCollector();

  const tree = (
    <ServerApp
      req={req}
      apollo={apollo}
      helmetContext={helmetContext}
      impersonation={impersonation}
    />
  );
  const render = (el: ReactElement) =>
    renderToString(location.wrap(collector.wrap(ssrStyles.wrap(el))));

  // `renderToString` is synchronous, so every lazy component has to already be
  // resolved before rendering starts. On the server `loadable()` fires its
  // import at *definition* time, so this drains the graph transitively.
  let markup = '';
  let pass = 0;
  while (pass < MAX_RENDER_PASSES) {
    pass++;
    await whenLoadablesSettle();
    markup = await getMarkupFromTree({ tree, renderFunction: render });
    if (!hasPendingLoadables()) {
      break;
    }
    // A render reached a loadable whose module was not registered when the
    // pass started, so its fallback is in the markup. Settle and render
    // again. This outer loop is required rather than defensive:
    // `getMarkupFromTree` re-renders only for *Apollo* promises
    // (`renderPromises.hasPromises()`), never for module resolution.
    if (pass === MAX_RENDER_PASSES && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `[ssr] loadables still pending after ${MAX_RENDER_PASSES} render passes; ` +
          'markup may contain fallbacks'
      );
    }
  }
  const { helmet } = helmetContext as FilledContext; // now filled

  if (location.url) {
    res.redirect(location.statusCode ?? 302, location.url);
    return;
  }

  const chunkIds = collector.chunkIds;
  const fullMarkup = indexHtml({
    markup,
    helmet,
    assets: renderAssets(chunkIds),
    emotion: ssrStyles.extract(markup),
    globals: {
      env: clientEnv,
      __APOLLO_STATE__: apollo.extract(),
      __APOLLO_ERRORS__: errorCache,
      // Source ids, not chunk URLs. `loadableReady` looks each one up in the
      // registry and calls the `import()` it registered, so a wrong asset
      // manifest costs preload hints but never correctness.
      __LOADABLE_IDS__: chunkIds,
    },
  });
  res.status(location.statusCode ?? 200).send(fullMarkup);
};

class SsrStyles {
  private muiCache?: EmotionCache;
  private tssCache?: EmotionCache;
  private servers?: EmotionServer[];

  wrap(el: ReactElement) {
    this.muiCache = createMuiEmotionCache();
    this.tssCache = createTssEmotionCache();
    this.servers = [this.muiCache, this.tssCache].map(createEmotionServer);
    return (
      <CacheProvider value={this.muiCache}>
        <TssCacheProvider value={this.tssCache}>{el}</TssCacheProvider>
      </CacheProvider>
    );
  }

  extract(markup: string) {
    if (!this.servers) {
      return '';
    }
    return this.servers
      .map((server) =>
        server.constructStyleTagsFromChunks(
          server.extractCriticalToChunks(markup)
        )
      )
      .join('');
  }
}

const ServerApp = ({
  req,
  helmetContext,
  apollo,
  impersonation,
}: {
  req: ExpressRequest;
  helmetContext?: Partial<FilledContext>;
  apollo: ApolloClient<unknown>;
  impersonation: Impersonation | null;
}) => (
  <Nest
    elements={[
      <HelmetProvider
        key="helmet"
        context={helmetContext || {}}
        children={[]}
      />,
      <RequestContext.Provider key="req" value={req} />,
      <StaticRouter
        key="router"
        basename={basePath}
        location={req.originalUrl}
      />,
      <ImpersonationProvider key="impersonation" initial={impersonation} />,
      <ApolloProvider key="apollo" client={apollo} children={[]} />,
    ]}
  >
    <App />
  </Nest>
);

const BROWSER_SAFE_RAZZLE_KEYS = new Set([
  'RAZZLE_API_BASE_URL',
  'RAZZLE_GIT_HASH',
  'RAZZLE_LOG_ROCKET_APP_ID',
  'RAZZLE_NON_PROD_WARNING',
  'RAZZLE_OPEN_SEARCH',
  'RAZZLE_POSTHOG_ALL_FLAGS',
  'RAZZLE_POSTHOG_HOST',
  'RAZZLE_POSTHOG_KEY',
]);

const clientEnv: NodeJS.ProcessEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PUBLIC_URL: trailingSlash(process.env.PUBLIC_URL),
  VERSION: process.env.VERSION,
  ...pickBy(
    process.env,
    (val, key) =>
      BROWSER_SAFE_RAZZLE_KEYS.has(key) ||
      key.startsWith('RAZZLE_POSTHOG_FLAG_')
  ),
};
