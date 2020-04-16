import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

if (process.env.NODE_ENV !== 'production') {
  // Add lodash to dev console
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  import('lodash').then((_) => ((window as any)._ = _));
  // Add luxon to dev console
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  import('luxon').then((l) => Object.assign(window as any, l));
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
