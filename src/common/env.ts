/**
 * Runtime environment variables, readable on both the server and the client.
 *
 * On the server this is the real {@link process.env}.
 * In the browser it is the allowlisted, per-request object that
 * `src/server/renderServerSideApp.tsx` serializes and
 * `src/server/indexHtml.ts` emits as `window.env`.
 *
 * Use this for anything that is configurable at runtime, so that one build can
 * be deployed to many environments. Build-time constants, like `NODE_ENV`,
 * should keep reading `process.env` directly — bundlers inline those as string
 * literals, which is what lets dead branches be tree-shaken away.
 */
export const env =
  typeof window !== 'undefined' && window.env ? window.env : process.env;
