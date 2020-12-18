import express from 'express';
import { app } from './server/server';

let currentApp = app;

if (module.hot) {
  module.hot.accept('./server/server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
      currentApp = require('./server/server').app;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = process.env.PORT || 3000;

// eslint-disable-next-line import/no-default-export
export default Promise.resolve().then(() =>
  express()
    .use((req, res) => currentApp(req, res))
    .listen(port, () => {
      console.log(`> Started on port ${port}`);
    })
);
