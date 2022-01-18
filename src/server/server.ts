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
