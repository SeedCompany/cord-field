/* eslint-disable import/no-default-export */

/**
 * `@vitejs/plugin-react` ships its types only through a package `exports` map,
 * which this project's `moduleResolution: node` predates — so TS reports
 * TS2307 even though the declarations are right there. Point it at the real
 * declaration file.
 *
 * Delete this once the project moves to `moduleResolution: bundler`.
 */
declare module '@vitejs/plugin-react' {
  export * from '@vitejs/plugin-react/dist/index.js';
  export { default } from '@vitejs/plugin-react/dist/index.js';
}
