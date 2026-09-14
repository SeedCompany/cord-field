import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { appPlugins } from './vite/plugins';
import { clientNodePolyfills } from './vite/plugins/clientNodePolyfills';
import { devSsr } from './vite/plugins/devSsr';

// Populate process.env from the .env* files before the config below reads it.
// Two things depend on it: the `MUI_X_LICENSE_KEY` define here, and — far more
// subtly — the dev server, where `renderServerSideApp` builds `clientEnv` from
// this process's `process.env`. Without it every GraphQL call in dev silently
// targets the wrong host.
//
// Deliberately CJS (see config/loadDotenv.cjs) so `ts-node -r` and this config
// share one copy; Vite compiles this file as CJS, so `require` is defined.
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('./config/loadDotenv.cjs');

const src = fileURLToPath(new URL('./src', import.meta.url));

/**
 * The client entry. The key `assets.ts` looks for in `manifest.json` is this
 * path, so the two have to agree.
 */
const clientEntry = 'src/client.tsx';

/**
 * The heavy barrels. `babel-plugin-transform-imports` used to rewrite the MUI
 * ones to deep paths; Rollup tree-shakes MUI's ESM without help, so the only
 * thing left to solve is dev cold-start, and prebundling — not a transform —
 * is the right tool for that.
 */
const prebundle = [
  '@mui/material',
  '@mui/material/styles',
  '@mui/icons-material',
  '@mui/lab',
  '@mui/system',
  '@mui/base',
  '@mui/x-data-grid-pro',
  '@mui/x-date-pickers',
  '@mui/x-tree-view',
  'lodash',
  'luxon',
  '@apollo/client',
  'react-dnd',
  'reactflow',
];

/**
 * Dependencies that have to be bundled into the SSR graph rather than left
 * external.
 *
 * Razzle's server bundle was CommonJS, so `webpack-node-externals` could leave
 * every dependency to `require()` and Node's CJS loader handed back
 * `module.exports` whole — named imports always worked. Vite's SSR graph is
 * ESM, and Node's ESM loader only synthesizes named exports for a CJS module
 * when its static analysis can see them. Every package below fails that
 * analysis (or resolves to a CJS build despite shipping ESM), so a named
 * import throws "The requested module '…' is a CommonJS module". Bundling
 * them through Vite restores exactly the resolution webpack used.
 *
 * Additions belong here rather than inline in `ssr.noExternal`: each one is
 * a discovered interop fact about a dependency, not a decision about this app.
 */
const ssrCjsInterop = [
  // `"type": "module"` but `main` points at `main.cjs` and there is no
  // `exports` map, so Node resolves the CommonJS build.
  '@apollo/client',
  'react-dropzone',
];

/**
 * `vite` (dev) now serves the app end to end — one process, one port, SSR
 * included. `vite build` still only produces the client bundle, and neither is
 * wired into `yarn start`/`yarn build` yet: the production build is
 * `stage-03-issue-03` and the script/CI/Dockerfile cutover is
 * `stage-04-issue-01`.
 */
export default defineConfig(({ isSsrBuild, mode }) => {
  const isProd = mode === 'production';
  return {
    plugins: [
      ...appPlugins(),
      // Mounts the Express app inside Vite's connect stack, replacing
      // webpack-dev-server + the catch-all proxy to a second port.
      devSsr(),
      // Client only — and in dev that has to be actively enforced rather than
      // merely intended, which is what `clientNodePolyfills` is for.
      // webpack 4 auto-polyfilled these; Vite polyfills nothing,
      // and the previewer libraries (mammoth, @iarna/rtf-to-html,
      // @freiraum/msgreader, file-type@16, xlsx) need them. The allowlist is
      // deliberately narrow: shimming fs/crypto/http wholesale would hide real
      // mistakes behind a shim that silently does nothing.
      ...(isSsrBuild
        ? []
        : clientNodePolyfills({
            include: ['buffer', 'stream', 'util', 'events', 'process', 'path'],
            globals: { Buffer: true, global: true, process: true },
          })),
    ],

    resolve: {
      alias: [
        // tsconfig's `~/*` -> `src/*`. Hand-written rather than
        // vite-tsconfig-paths, because tsconfig also maps `"*":
        // ["./typings/*"]`, which would make that plugin try resolving every
        // bare specifier against `typings/`. That mapping is TS-only.
        { find: '~', replacement: src },
        // `lodash` is CommonJS, so `import { pick } from 'lodash'` does not
        // tree-shake under Rollup — without this we would silently ship the
        // whole library (~25 KB gz) now that
        // `babel-plugin-transform-imports` is gone. Exact match only, so
        // third-party `lodash/foo` deep imports keep using the CJS copy.
        // `lodash-es`'s version is pinned to `lodash`'s in package.json;
        // they must stay in lockstep.
        { find: /^lodash$/, replacement: 'lodash-es' },
        // `react-dnd@15` does `import … from 'react/jsx-runtime.js'`, which
        // react 18's `exports` map does not expose (only `./jsx-runtime`).
        // webpack 4 ignored `exports` maps entirely, so this never surfaced;
        // Vite honours them and the build fails outright without the alias.
        { find: /^react\/jsx-runtime\.js$/, replacement: 'react/jsx-runtime' },
      ],
      // Two Emotion instances mean two style registries, which silently
      // breaks `createMuiEmotionCache` / `TssCacheProvider`.
      dedupe: [
        'react',
        'react-dom',
        '@emotion/react',
        '@emotion/styled',
        '@emotion/cache',
      ],
    },

    define: {
      // Exact keys only. `define: { 'process.env': 'window.env' }` — webpack's
      // trick, and what `razzle.config.js` does — is NOT viable: stage 0
      // measured it rewriting the member-chain prefix in `vite build` but
      // silently not in `vite dev`, where the surviving `process.env.*` reads
      // throw `ReferenceError: process is not defined`. Runtime env goes
      // through the `env` accessor in `src/common/env.ts` instead.
      //
      // A build-time secret, not a per-deployment one, so inlining is correct.
      'process.env.MUI_X_LICENSE_KEY': JSON.stringify(
        process.env.MUI_X_LICENSE_KEY
      ),
      // https://github.com/apollographql/apollo-client/pull/8347 — Apollo 3.4+
      // reads this global. Only in prod; in dev Apollo defines it itself.
      ...(isProd ? { __DEV__: 'false' } : {}),
      // `process.env.NODE_ENV` needs no entry: Vite defines it in both dev and
      // build, and stage 0 confirmed it resolves to a plain string literal
      // either way.
      //
      // Client only — on the server `global` is real. Paired with
      // nodePolyfills' `globals.global`, which supplies the shim import; this
      // covers the libraries that read a bare `global` without importing it.
      ...(isSsrBuild ? {} : { global: 'globalThis' }),
    },

    // Reproduces `DynamicPublicPathPlugin`: asset URLs resolve from
    // `window.env.PUBLIC_URL` at *runtime*, so one image can be deployed to
    // many environments. Viable only because every rewritable reference is
    // JS-hosted — zero CSS files in `src/` and one asset import
    // (AuthLayout's background.png). `{ runtime }` cannot rewrite `url()`
    // inside emitted CSS, hence the `relative` fallback there.
    experimental: {
      renderBuiltUrl: (filename, { hostType }) =>
        hostType === 'css'
          ? { relative: true }
          : // The helper lives next to `window.env` in `indexHtml.ts` so that
            // PUBLIC_URL normalisation keeps one home (`src/common/urls.ts`)
            // instead of being inlined into every chunk.
            { runtime: `window.__assetUrl(${JSON.stringify(filename)})` },
    },

    // `custom`, not `spa`/`mpa`: there is no `index.html` to serve or
    // transform. Vite must not install its own html-serving fallback
    // middleware, because `devSsr`'s middleware — and `renderServerSideApp`
    // behind it — is the fallback.
    appType: 'custom',

    server: {
      // Same `PORT` the app has always used, from `.env`. One port now, where
      // Razzle took this one for webpack-dev-server and gave Express
      // `PORT + 1`.
      port: Number(process.env.PORT) || 3001,
      // Fail loudly rather than silently sliding to 3002. A surprise port is
      // how you end up with a stale server answering on the one you expect.
      strictPort: true,
    },

    optimizeDeps: { include: prebundle },

    // Razzle does not bundle node_modules into the server either — its
    // `buildType: 'iso'` uses webpack-node-externals — so leaving
    // `noExternal` at its default preserves today's behavior. `lodash-es` is
    // the one exception: it only reaches the SSR graph through the alias
    // above, so it has to be bundled rather than externalized.
    ssr: {
      noExternal: [
        // Only reaches the SSR graph through the `lodash` alias above, so it
        // has to be bundled rather than externalized.
        'lodash-es',
        ...ssrCjsInterop,
      ],
    },

    build: {
      outDir: 'build/public',
      sourcemap: true,
      // Both are consumed by `src/server/assets.ts`.
      manifest: true,
      ssrManifest: true,
      // For xlsx's UMD build.
      commonjsOptions: { transformMixedEsModules: true },
      rollupOptions: {
        input: { client: clientEntry },
        output: {
          entryFileNames: 'static/[name].[hash].js',
          chunkFileNames: 'static/[name].[hash].js',
          assetFileNames: 'static/[name].[hash][extname]',
          // Do NOT add `experimentalMinChunkSize`: Rollup would merge chunks
          // out of the manifest and `assets.ts` could no longer find them.
        },
        // `CircularDependencyPlugin` runs with `failOnError: true` today,
        // which means real cycles exist in this codebase and are being
        // actively held back. Rollup only warns, so without this the guard is
        // silently lost and SSR module-init-order bugs become possible.
        // Server build only, same exclusions as razzle.config.js.
        ...(isProd && isSsrBuild
          ? {
              onwarn: (warning, defaultHandler) => {
                if (warning.code !== 'CIRCULAR_DEPENDENCY') {
                  // Hand everything else back, so Vite's own warning
                  // filtering is not lost by defining this hook.
                  defaultHandler(warning);
                  return;
                }
                const cycle = warning.ids ?? [];
                const excluded = cycle.some(
                  (id) =>
                    id.includes('node_modules') ||
                    id.includes(join('src', 'components', 'files'))
                );
                if (excluded) {
                  return;
                }
                throw new Error(
                  `Circular dependency: ${cycle.join(' -> ')}\n${
                    warning.message
                  }`
                );
              },
            }
          : {}),
      },
    },
  };
});
