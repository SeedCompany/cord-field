import 'source-map-support/register';
import { createTerminus } from '@godaddy/terminus';
import { create } from './server/server';

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
