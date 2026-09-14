import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as path from 'path';
import responseTime from 'response-time';
import { createClient as createApollo } from '~/api/client/createClient';
import { basePathOfUrl, withoutTrailingSlash } from '~/common';
import { LogoutDocument } from '../scenes/Authentication/Logout/logout.graphql';
import { renderServerSideApp } from './renderServerSideApp';

/**
 * Where the built client assets live, for `express.static` below.
 *
 * Only the production branch matters. In dev, Vite's `publicDir` middleware
 * has already served `public/` by the time this Express app is reached (see
 * `vite/plugins/devSsr.ts`), so `express.static` never matches anything —
 * but the path still has to *evaluate*, and `__dirname` does not exist in
 * Vite's ESM SSR graph. Hence the branch: `process.env.NODE_ENV` is
 * `'development'` there, so the `__dirname` arm is never reached.
 *
 * `import.meta.url` is not an option here: the server bundle is emitted as
 * CommonJS, which is also what makes `__dirname` available in the first
 * place.
 */
const PUBLIC_DIR =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, 'public')
    : path.resolve(process.cwd(), 'public');
const PUBLIC_URL = withoutTrailingSlash(process.env.PUBLIC_URL || '');
const BASE_PATH = withoutTrailingSlash(basePathOfUrl(PUBLIC_URL));

// getting 'canonizeResults' false positive, maybe this:
// https://github.com/apollographql/apollo-client/issues/12917
(global as any)[Symbol.for('apollo.deprecations')] = true;

export const create = async () => {
  const app = express();
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

  // Allow images to be served from anywhere.
  // Emails reference these images, and they can be rendered anywhere.
  router.use('/images/*', cors(), (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  // The manifests the client build writes into `build/public/.vite/` are
  // build metadata, not public assets — `assets.ts` reads them off disk. This
  // has to come *before* `express.static`, which serves them quite happily:
  // its `dotfiles` default is no special treatment at all.
  //
  // `'/.vite'` and not `'.vite/*'`, matching the rule below: with an explicit
  // `*` the matched prefix swallows the trailing slash, and `trim_prefix` then
  // rejects the layer because the remainder does not start on a path
  // separator. A plain prefix mount has no such problem.
  router.use('/.vite', (req, res) => res.sendStatus(404));

  // Serve static assets
  router.use(
    express.static(PUBLIC_DIR, {
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

  // Proxy for Rev79 Seed API — keeps RAZZLE_SEED_API_SECRET server-side only
  const SEED_ALLOWED_OPS = new Set(['GetCommunitiesByProjectId']);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/api/seed-proxy', async (req, res, next) => {
    const host = process.env.SEED_API_HOST;
    const secret = process.env.SEED_API_SECRET;
    if (!host || !secret) {
      res.sendStatus(503);
      return;
    }
    const { operationName } = req.body as { operationName?: unknown };
    if (
      typeof operationName !== 'string' ||
      !SEED_ALLOWED_OPS.has(operationName)
    ) {
      res.sendStatus(400);
      return;
    }
    try {
      const upstream = await fetch(`${host}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: secret,
          'apollo-require-preflight': '1',
        },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(10_000),
      });
      const data = await upstream.json();
      res.status(upstream.status).json(data);
    } catch (err) {
      next(err);
    }
  });

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

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.use(renderServerSideApp);

  return app;
};
