import 'source-map-support/register';
import { createTerminus } from '@godaddy/terminus';
import * as path from 'path';
import { create } from './server/server';

/**
 * Where Vite wrote the two asset manifests, for `src/server/assets.ts`.
 *
 * This replaces the `process.env.LOADABLE_STATS_MANIFEST` define that
 * `razzle.config.js` used to inject. It cannot be a `define`: `assets.ts`
 * looks these up as `process.env[envVar]`, a *dynamic* key, and Vite's
 * `define` only substitutes literal dotted member expressions. So they have
 * to be real runtime values, and this is the one place that runs before any
 * request is served.
 *
 * Derived from `__dirname` (i.e. `build/`) rather than `process.cwd()` so the
 * server is startable from anywhere, and assigned with `??=` so a deployment
 * can still override them. Get this wrong and the page silently renders with
 * no `<script>` tag at all — `assets.ts` warns once and degrades to no tags.
 */
const manifestDir = path.resolve(__dirname, 'public', '.vite');
process.env.CLIENT_MANIFEST_PATH ??= path.join(manifestDir, 'manifest.json');
process.env.SSR_MANIFEST_PATH ??= path.join(manifestDir, 'ssr-manifest.json');

/**
 * The production server entry, and only that.
 *
 * In dev nothing here runs: `vite/plugins/devSsr.ts` mounts `server.ts`'s
 * Express app inside Vite's own connect stack, and Vite owns the socket. So
 * the `module.hot.accept('./server/server')` block that used to live here is
 * gone — Vite's SSR module graph invalidates the changed module *and its
 * importers*, which is what that block could never do.
 *
 * One port, too. `SERVER_PORT` existed only because webpack-dev-server took
 * `PORT` for itself and proxied to Express on `PORT + 1`; with the proxy gone
 * there is nothing to distinguish.
 */
// eslint-disable-next-line import/no-default-export
export default create().then((app) => {
  const server = app.listen(process.env.PORT, () => {
    console.log(`> Started on port ${process.env.PORT}`);
  });

  createTerminus(server, {
    signals: ['SIGINT', 'SIGTERM'],
    healthChecks: {
      '/health': async () => {
        // we're good?
      },
    },
  });
});
