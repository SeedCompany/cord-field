// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import 'react-intersection-observer/test-utils';

import '@emotion/jest';

// jsdom doesn't provide these globals, but @auth0/auth0-react's dependency
// (@auth0/auth0-spa-js) references TextEncoder/TextDecoder at import time, so
// any test that touches a module importing it (even transitively, e.g. via
// src/App.tsx -> Root -> Authentication -> Login/Callback) fails to load
// without this.
import { TextDecoder, TextEncoder } from 'util';

// Node's `util.TextEncoder`/`TextDecoder` are runtime-compatible with the DOM
// lib globals jsdom expects, but their TS types don't line up exactly — cast
// rather than widen the global type.
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}
