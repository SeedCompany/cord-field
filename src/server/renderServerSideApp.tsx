import {
  ApolloClient,
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
import * as path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { possibleTypes } from '../api/fragmentMatcher.generated';
import { typePolicies } from '../api/typePolicies';
import { App } from '../App';
import { Nest } from '../components/Nest';
import { ServerLocation } from '../components/Routing';
import { ServerData, ServerDataProvider } from '../components/ServerData';
import { SnackbarProvider } from '../components/Snackbar';
import { UserAgentContext } from '../hooks';
import { fetchDataForRender } from './fetchDataForRender';
import { indexHtml } from './indexHtml';

const serverHost = process.env.RAZZLE_API_BASE_URL || '';

const createServerApolloClient = (req: Request) => {
  const httpLink = new HttpLink({
    uri: `${serverHost}/graphql`,
    credentials: 'include',
    // @ts-expect-error not sure why these fetch types are not aligning but this is how they say to do it
    fetch,
    headers: {
      cookie: req.header('Cookie'),
    },
  });

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
    link: httpLink,
  });
};

export const renderServerSideApp = async (req: Request, res: Response) => {
  const apollo = createServerApolloClient(req);

  const helmetContext: Partial<FilledContext> = {};
  const extractor = new ChunkExtractor({
    statsFile: path.resolve('build/loadable-stats.json'),
    entrypoints: ['client'],
  });
  const sheets = new ServerStyleSheets();
  const location = new ServerLocation();

  const data = await fetchDataForRender(
    location.wrap(<ServerApp req={req} apollo={apollo} />),
    req
  );

  const markup = await getMarkupFromTree({
    tree: (
      <ServerApp
        req={req}
        data={data}
        apollo={apollo}
        helmetContext={helmetContext}
      />
    ),
    renderFunction: (tree) =>
      ReactDOMServer.renderToString(
        location.wrap(sheets.collect(extractor.collectChunks(tree)))
      ),
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
      <StaticRouter location={req.url} />,
      <UserAgentContext.Provider value={req.headers['user-agent']} />,
      <ApolloProvider client={apollo} children={<></>} />,
      <SnackbarProvider />,
    ]}
  >
    <App />
  </Nest>
);
