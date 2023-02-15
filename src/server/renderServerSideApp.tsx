import { ApolloClient, ApolloProvider } from '@apollo/client';
import { getMarkupFromTree } from '@apollo/client/react/ssr';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionServer, {
  EmotionServer,
} from '@emotion/server/create-instance';
import { ChunkExtractor } from '@loadable/server';
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
  Impersonation,
  impersonationFromCookie,
  ImpersonationProvider,
} from '../api/client/ImpersonationContext';
import { App } from '../App';
import { Nest } from '../components/Nest';
import { ServerLocation } from '../components/Routing';
import { RequestContext } from '../hooks';
import { createMuiEmotionCache, createTssEmotionCache } from '../theme/emotion';
import { indexHtml } from './indexHtml';

const basePath = basePathOfUrl(process.env.PUBLIC_URL);

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
  const extractor = new ChunkExtractor({
    statsFile: process.env.LOADABLE_STATS_MANIFEST!,
    publicPath:
      process.env.NODE_ENV !== 'production'
        ? // Doesn't work in dev, due to something with webpack dev server config & hot reloading
          undefined
        : trailingSlash(process.env.PUBLIC_URL),
    entrypoints: ['client'],
  });

  const ssrStyles = new SsrStyles();

  const location = new ServerLocation();

  const markup = await getMarkupFromTree({
    tree: (
      <ServerApp
        req={req}
        apollo={apollo}
        helmetContext={helmetContext}
        impersonation={impersonation}
      />
    ),
    renderFunction: (tree) => {
      return renderToString(
        location.wrap(extractor.collectChunks(ssrStyles.wrap(tree)))
      );
    },
  });
  const { helmet } = helmetContext as FilledContext; // now filled

  if (location.url) {
    res.redirect(location.statusCode ?? 302, location.url);
    return;
  }

  const fullMarkup = indexHtml({
    markup,
    helmet,
    extractor,
    emotion: ssrStyles.extract(markup),
    globals: {
      env: clientEnv,
      __APOLLO_STATE__: apollo.extract(),
      __APOLLO_ERRORS__: errorCache,
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

const clientEnv: NodeJS.ProcessEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PUBLIC_URL: trailingSlash(process.env.PUBLIC_URL),
  VERSION: process.env.VERSION,
  ...pickBy(process.env, (val, key) => key.startsWith('RAZZLE_')),
};
