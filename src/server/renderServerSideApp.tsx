import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  TypePolicies,
} from '@apollo/client';
import { getMarkupFromTree } from '@apollo/client/react/ssr';
import { ChunkExtractor } from '@loadable/server';
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import React from 'react';
import { resetServerContext } from 'react-beautiful-dnd';
import ReactDOMServer from 'react-dom/server';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { possibleTypes } from '../api/fragmentMatcher.generated';
import { ErrorCache, ErrorCacheLink } from '../api/links/errorCache.link';
import { typePolicies } from '../api/typePolicies';
import { App } from '../App';
import { Nest } from '../components/Nest';
import { ServerLocation } from '../components/Routing';
import { ServerData, ServerDataProvider } from '../components/ServerData';
import { RequestContext } from '../hooks';
import { indexHtml } from './indexHtml';

const serverHost = process.env.RAZZLE_API_BASE_URL || '';

export const createServerApolloClient = (
  req: Request,
  errorCache: ErrorCache
) => {
  const httpLink = new HttpLink({
    uri: `${serverHost}/graphql`,
    credentials: 'include',
    // @ts-expect-error not sure why these fetch types are not aligning but this is how they say to do it
    fetch,
    headers: {
      cookie: req.header('Cookie'),
    },
  });

  const errorCacheLink = new ErrorCacheLink(errorCache, true);

  const cache = new InMemoryCache({
    possibleTypes,
    // Yes the assertion is necessary. It's because, as of TS 4.0, index
    // signatures still incorrectly convey that values for missing keys
    // would still give the expected value instead of undefined, which is
    // absolutely how JS works. I believe this is getting fixed finally in 4.1.
    // See: https://github.com/microsoft/TypeScript/pull/39560
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    typePolicies: typePolicies as TypePolicies,
  });

  return new ApolloClient({
    ssrMode: true,
    cache,
    link: ApolloLink.concat(errorCacheLink, httpLink),
  });
};

export const renderServerSideApp = async (req: Request, res: Response) => {
  const errorCache = {};
  const apollo = createServerApolloClient(req, errorCache);

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
  req: Request;
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
