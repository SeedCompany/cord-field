import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

const setup: Array<Promise<any>> = [];

if (process.env.NODE_ENV !== 'production') {
  const devSetUp = async () => {
    // Add lodash, temporal objs to dev console
    Object.assign(
      window,
      await import('lodash').then((_) => ({ _ })),
      await import('luxon'),
      await import('./util/CalenderDate')
    );
    // Do hacking to show dates easier
    await import('./util/hacky-inspect-dates');
  };
  setup.push(devSetUp());
}

const root = document.getElementById('root');

// eslint-disable-next-line @typescript-eslint/no-floating-promises
Promise.all(setup).then(() => {
  ReactDOM.render(<App />, root);
});
