import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable @typescript-eslint/no-floating-promises */
  // Add lodash to dev console
  import('lodash').then((_) => ((window as any)._ = _));
  // Add luxon to dev console
  import('luxon').then((l) => Object.assign(window as any, l));
  import('./util/CalenderDate').then((m) => Object.assign(window as any, m));
  /* eslint-enable @typescript-eslint/no-floating-promises */
}

const root = document.getElementById('root');
ReactDOM.render(<App />, root);
