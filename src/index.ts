import express from 'express';
import { app } from './server/server';

// Suppress experimental warning for AbortController
if (typeof AbortController !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const emitWarning = process.emitWarning;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  process.emitWarning = () => {};
  new AbortController();
  process.emitWarning = emitWarning;
}

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

// eslint-disable-next-line import/no-default-export
export default Promise.resolve().then(() =>
  express()
    .use((req, res) => currentApp(req, res))
    .listen(process.env.SERVER_PORT, () => {
      console.log(`> Started on port ${process.env.PORT}`);
    })
);
