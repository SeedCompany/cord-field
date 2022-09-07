import 'source-map-support/register';
import { createTerminus } from '@godaddy/terminus';
import express from 'express';
import { create } from './server/server';

let currentApp: express.Express;

if (module.hot) {
  module.hot.accept('./server/server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    import('./server/server')
      .then((server) => server.create())
      .then((app) => {
        currentApp = app;
      })
      .catch((error) => console.error(error));
  });
  console.info('✅  Server-side HMR Enabled!');
}

// eslint-disable-next-line import/no-default-export
export default create().then((app) => {
  currentApp = app;
  const server = express()
    .use((req, res) => currentApp(req, res))
    .listen(process.env.SERVER_PORT, () => {
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
