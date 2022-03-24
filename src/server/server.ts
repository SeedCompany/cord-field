import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import * as path from 'path';
import responseTime from 'response-time';
import { createClient as createApollo } from '~/api/client/createClient';
import { LogoutDocument } from '../scenes/Authentication/Logout/logout.graphql';
import { basePathOfUrl, withoutTrailingSlash } from '../util';
import { renderServerSideApp } from './renderServerSideApp';

const PUBLIC_URL = withoutTrailingSlash(process.env.PUBLIC_URL || '');
const BASE_PATH = withoutTrailingSlash(basePathOfUrl(PUBLIC_URL));

export const app = express();
const router: express.Router = BASE_PATH ? express.Router() : app;
BASE_PATH && app.use(BASE_PATH, router);

router.use(compression());
router.use(
  helmet({
    contentSecurityPolicy: false,
    hidePoweredBy: true,
  })
);
router.use(bodyParser.json());
router.use(cookieParser());

// Serve static assets
router.use(
  express.static(path.resolve(__dirname, 'public'), {
    maxAge: '30 days',
  })
);

// Send 404 for not found static assets
router.use(['static/*', 'images/*'], (req, res) => res.sendStatus(404));

// Serve Open Search config
if (process.env.RAZZLE_OPEN_SEARCH === 'true') {
  router.get('opensearch.xml', (req, res) => {
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

router.get('logout', (req, res, next) => {
  createApollo({ ssr: { req, res } })
    .mutate({
      mutation: LogoutDocument,
    })
    .then(() => res.redirect('login'))
    .catch((e) => next(e));
});

router.use(
  responseTime((_req, res, time) => {
    res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
    res.setHeader('Server-Timing', `renderServerSideApp;dur=${time}`);
  })
);

router.use(renderServerSideApp);
