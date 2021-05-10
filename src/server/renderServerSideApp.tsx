import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
} from '@apollo/client';
import { getMarkupFromTree } from '@apollo/client/react/ssr';
import { ChunkExtractor } from '@loadable/server';
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets';
import fetch from 'cross-fetch';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import React from 'react';
import { resetServerContext } from 'react-beautiful-dnd';
import ReactDOMServer from 'react-dom/server';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { createCache } from '../api';
import { ErrorCache, ErrorCacheLink } from '../api/links/errorCache.link';
import { App } from '../App';
import { Nest } from '../components/Nest';
import { ServerLocation } from '../components/Routing';
import { ServerData, ServerDataProvider } from '../components/ServerData';
import { RequestContext } from '../hooks';
import { indexHtml } from './indexHtml';

const serverHost = process.env.RAZZLE_API_BASE_URL || '';

export const createServerApolloClient = (
  req: ExpressRequest,
  res: ExpressResponse,
  errorCache: ErrorCache
) => {
  const httpLink = new HttpLink({
    uri: `${serverHost}/graphql`,
    credentials: 'include',
    fetch,
    headers: {
      cookie: req.header('Cookie'),
    },
  });

  const setCookieLink = new ApolloLink((op, forward) =>
    forward(op).map((result) => {
      // If response has new cookie values forward them on so the client can save them
      const { response } = op.getContext() as { response: Response };
      const newCookies = response.headers.get('set-cookie');
      if (newCookies) {
        res.setHeader('set-cookie', newCookies);
      }

      return result;
    })
  );

  const errorCacheLink = new ErrorCacheLink(errorCache, true);

  return new ApolloClient({
    ssrMode: true,
    cache: createCache(),
    link: ApolloLink.from([errorCacheLink, setCookieLink, httpLink]),
    connectToDevTools: true,
  });
};

export const renderServerSideApp = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const errorCache = {};
  const apollo = createServerApolloClient(req, res, errorCache);

  const helmetContext: Partial<FilledContext> = {};
  const extractor = new ChunkExtractor({
    statsFile: process.env.LOADABLE_STATS_MANIFEST!,
    entrypoints: ['client'],
  });
  const sheets = new ServerStyleSheets();
  const location = new ServerLocation();

  // Disabled for now. This was a PoC and it's not used right now.
  // All server data comes from the GQL API.
  // const data = await fetchDataForRender(
  //   location.wrap(<ServerApp req={req} apollo={apollo} />),
  //   req
  // );
  const data = {};

  const markup = await getMarkupFromTree({
    tree: (
      <ServerApp
        req={req}
        data={data}
        apollo={apollo}
        helmetContext={helmetContext}
      />
    ),
    renderFunction: (tree) => {
      resetServerContext();
      return ReactDOMServer.renderToString(
        location.wrap(sheets.collect(extractor.collectChunks(tree)))
      );
    },
  });
  const { helmet } = helmetContext as FilledContext; // now filled

  if (location.url) {
    res.redirect(location.url);
    return;
  }

  const fullMarkup = indexHtml({
    serverData: data,
    markup,
    helmet,
    extractor,
    sheets,
    apolloCache: apollo.extract(),
    errorCache,
  });
  res.status(location.statusCode ?? 200).send(fullMarkup);
};

const ServerApp = ({
  data,
  req,
  helmetContext,
  apollo,
}: {
  data?: ServerData;
  req: ExpressRequest;
  helmetContext?: Partial<FilledContext>;
  apollo: ApolloClient<unknown>;
}) => (
  <Nest
    elements={[
      <HelmetProvider context={helmetContext || {}} children={<></>} />,
      <ServerDataProvider value={data ?? {}} />,
      <RequestContext.Provider value={req} children={<></>} />,
      <StaticRouter location={req.url} />,
      <ApolloProvider client={apollo} children={<></>} />,
    ]}
  >
    <App />
  </Nest>
);
