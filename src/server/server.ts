import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import responseTime from 'response-time';
import { LogoutDocument } from '../scenes/Authentication/Logout/logout.generated';
import {
  createServerApolloClient,
  renderServerSideApp,
} from './renderServerSideApp';

const {
  PUBLIC_URL = '',
  RAZZLE_PUBLIC_DIR: PUBLIC_DIR = path.resolve(__dirname, '../public'),
} = process.env;

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

// Serve static assets
app.use(
  PUBLIC_URL,
  express.static(PUBLIC_DIR, {
    maxAge: '30 days',
  })
);

app.get('/logout', (req, res, next) => {
  createServerApolloClient(req)
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
