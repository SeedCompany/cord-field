import { ChunkExtractor } from '@loadable/server';
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets';
import { Request, Response } from 'express';
import * as path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { App } from '../App';
import { Nest } from '../components/Nest';
import { ServerData, ServerDataProvider } from '../components/ServerData';
import { UserAgentContext } from '../hooks';
import { fetchDataForRender } from './fetchDataForRender';
import { indexHtml } from './indexHtml';

export const renderServerSideApp = async (req: Request, res: Response) => {
  const data = await fetchDataForRender(ServerApp, req);

  const context: { url?: string; statusCode?: number } = {};
  const helmetContext: Partial<FilledContext> = {};

  const extractor = new ChunkExtractor({
    statsFile: path.resolve('build/loadable-stats.json'),
    entrypoints: ['client'],
  });
  const sheets = new ServerStyleSheets();
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      extractor.collectChunks(
        <ServerApp req={req} data={data} helmetContext={helmetContext} />
      )
    )
  );
  const { helmet } = helmetContext as FilledContext; // now filled

  if (context.url) {
    res.redirect(context.url);
    return;
  }

  const fullMarkup = indexHtml({
    serverData: data,
    markup,
    helmet,
    extractor,
    sheets,
  });
  res.status(context.statusCode ?? 200).send(fullMarkup);
};

const ServerApp = ({
  data,
  req,
  helmetContext,
}: {
  data: ServerData;
  req: Request;
  helmetContext?: Partial<FilledContext>;
}) => (
  <Nest
    elements={[
      <HelmetProvider context={helmetContext || {}} children={<></>} />,
      <ServerDataProvider value={data} />,
      <StaticRouter location={req.url} />,
      <UserAgentContext.Provider value={req.headers['user-agent']} />,
    ]}
  >
    <App />
  </Nest>
);
