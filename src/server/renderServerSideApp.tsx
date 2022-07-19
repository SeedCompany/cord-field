import { ApolloClient, ApolloProvider } from '@apollo/client';
import { getMarkupFromTree } from '@apollo/client/react/ssr';
import { ChunkExtractor } from '@loadable/server';
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { pickBy } from 'lodash';
import { resetServerContext } from 'react-beautiful-dnd';
import { renderToString } from 'react-dom/server';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { createClient } from '~/api/client/createClient';
import { ErrorCache } from '~/api/client/links/errorCache.link';
import { basePathOfUrl, trailingSlash } from '~/common';
import { App } from '../App';
import { Nest } from '../components/Nest';
import { ServerLocation } from '../components/Routing';
import { RequestContext } from '../hooks';
import { indexHtml } from './indexHtml';

const basePath = basePathOfUrl(process.env.PUBLIC_URL);

export const renderServerSideApp = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const errorCache: ErrorCache = {};
  const apollo = createClient({ ssr: { req, res }, errorCache });

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
  const sheets = new ServerStyleSheets();
  const location = new ServerLocation();

  const markup = await getMarkupFromTree({
    tree: <ServerApp req={req} apollo={apollo} helmetContext={helmetContext} />,
    renderFunction: (tree) => {
      resetServerContext();
      return renderToString(
        location.wrap(sheets.collect(extractor.collectChunks(tree)))
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
    sheets,
    globals: {
      env: clientEnv,
      __APOLLO_STATE__: apollo.extract(),
      __APOLLO_ERRORS__: errorCache,
    },
  });
  res.status(location.statusCode ?? 200).send(fullMarkup);
};

const ServerApp = ({
  req,
  helmetContext,
  apollo,
}: {
  req: ExpressRequest;
  helmetContext?: Partial<FilledContext>;
  apollo: ApolloClient<unknown>;
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
