import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import responseTime from 'response-time';
import { LogoutDocument } from '../scenes/Authentication/Logout/logout.generated';
import {
  createServerApolloClient,
  renderServerSideApp,
} from './renderServerSideApp';

export const app = express();

app.disable('x-powered-by');
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

const withoutEndingSlash = (url: string) =>
  url.endsWith('/') ? url.slice(0, -1) : url;
const PUBLIC_URL = process.env.PUBLIC_URL || '';
const BASE_PATH = withoutEndingSlash(
  PUBLIC_URL.startsWith('http') ? new URL(PUBLIC_URL).pathname : PUBLIC_URL
);

// Serve static assets
app.use(
  BASE_PATH,
  express.static(process.env.RAZZLE_PUBLIC_DIR!, {
    maxAge: '30 days',
  })
);

// Send 404 for not found static assets
app.use(
  ['/static/*', '/images/*'].map((path) => `${BASE_PATH}${path}`),
  (req, res) => res.sendStatus(404)
);

// Serve Open Search config
if (process.env.RAZZLE_OPEN_SEARCH === 'true') {
  app.get(`${BASE_PATH}/opensearch.xml`, (req, res) => {
    // language=XML
    const xml = `
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>CORD Field</ShortName>
  <Description>Search CORD Field</Description>
  <Image width="512" height="512" type="image/png">${PUBLIC_URL}/images/android-chrome-512x512.png</Image>
  <Image width="192" height="192" type="image/png">${PUBLIC_URL}/images/android-chrome-192x192.png</Image>
  <Image width="32" height="32" type="image/png">${PUBLIC_URL}/images/favicon-32x32.png</Image>
  <Image width="16" height="16" type="image/x-icon">${PUBLIC_URL}/images/favicon.ico</Image>
  <Url type="text/html" method="get" template="${PUBLIC_URL}/search?q={searchTerms}"/>
</OpenSearchDescription>
`.trim();

    res.type('application/xml').send(xml);
  });
}

app.get('/logout', (req, res, next) => {
  createServerApolloClient(req, res, {})
    .mutate({
      mutation: LogoutDocument,
    })
    .then(() => res.redirect('/login'))
    .catch((e) => next(e));
});

app.use(
  responseTime((_req, res, time) => {
    res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
    res.setHeader('Server-Timing', `renderServerSideApp;dur=${time}`);
  })
);

app.use(renderServerSideApp);
