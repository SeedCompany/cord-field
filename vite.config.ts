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
 * The SSR entry, owned here rather than on the command line so `build:server`
 * stays `vite build --ssr` with no argument.
 *
 * It has to be given twice, and the second one is the one that actually
 * decides: a bare `--ssr` sets the *inline* `build.ssr` to `true`, and inline
 * config wins over the config file, so Vite's entry resolution
 * (`typeof build.ssr === 'string' ? … : rollupOptions.input`) never sees the
 * string below. `rollupOptions.input` is what it falls through to — absolute,
 * because Rollup resolves a bare relative input against the cwd rather than
 * through Vite's resolver. `build.ssr` is kept anyway so a programmatic
 * `vite build` with `ssr: true` unset still finds the entry.
 */
const serverEntry = 'src/index.ts';
const serverEntryPath = fileURLToPath(
  new URL(`./${serverEntry}`, import.meta.url)
);

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

/** Everything bundled into the SSR graph rather than left to Node. */
const ssrBundled = [
  // Only reaches the SSR graph through the `lodash` alias above, so it has to
  // be bundled rather than externalized.
  'lodash-es',
  ...ssrCjsInterop,
];

/**
 * A bare package specifier — `express`, `@mui/material/styles` — as opposed to
 * a relative path, a `~/…` alias, a `virtual:…` id or one of Rollup's
 * `\0`-prefixed internals. The leading character class is what excludes `~`.
 */
const packageImportRE = /^(?:@[a-z0-9][\w.-]*\/)?[a-z0-9][\w.-]*(?:\/.+)?$/i;

/**
 * Bare imports that are *not* JavaScript, and so must be bundled even though
 * they name a package: `reactflow/dist/style.css`. `require()`ing one at
 * runtime would throw.
 */
const nonJsImportRE =
  /\.(css|less|sass|scss|styl|json|svg|png|jpe?g|gif|webp|avif|woff2?|ttf|otf|eot)(\?.*)?$/i;

/**
 * Whether to leave this import for Node to resolve, with its specifier
 * untouched.
 *
 * This is the one deviation from letting Vite decide, and it exists because
 * **Vite's externalization is written for an ESM bundle and this one is CJS.**
 * Vite resolves an external itself and emits the file it landed on, choosing
 * ESM: `@mui/material/styles` becomes `@mui/material/styles/index.js` (walking
 * past the nested `styles/package.json` whose `main` is the CommonJS build) and
 * `posthog-js/react` becomes `posthog-js/react/dist/esm/index.js` (ignoring its
 * `main`). `require()`ing those ESM files is what fails — with a directory
 * import Node's ESM resolver rejects:
 *
 *     Error: Directory import '…/@mui/utils/formatMuiErrorMessage' is not
 *     supported resolving ES modules imported from …/@mui/material/styles/index.js
 *
 * or, worse, without an error at all: a second, ESM copy of a package the
 * bundle also holds as CJS, so `posthog-js/react`'s provider and consumer end
 * up on different React contexts.
 *
 * Rollup consults `external` with the *raw* specifier before any resolver
 * runs, so returning `true` here is the only way to keep it bare — which is
 * precisely what `webpack-node-externals` did under Razzle, leaving nested
 * `main` fields and `require` conditions to Node. Returning `undefined` hands
 * the id back to Vite, so `ssr.noExternal` and Vite's own builtin handling
 * still apply to everything else.
 */
const keepExternal = (id: string) =>
  packageImportRE.test(id) &&
  !nonJsImportRE.test(id) &&
  !ssrBundled.some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
    ? true
    : undefined;

/**
 * `vite` (dev) serves the app end to end — one process, one port, SSR
 * included — and `vite build` now produces the whole production artifact in
 * two passes: `build:client` writes `build/public/`, then `build:server`
 * writes `build/server.js`. This is the only build chain — Razzle and webpack
 * are gone.
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
      // trick, and what the old `razzle.config.js` did — is NOT viable: stage 0
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
    //
    // Client build only, and that is a correctness requirement, not tidiness:
    // `AuthLayout` is in the SSR graph too, so a `window.__assetUrl(...)`
    // expression in `server.js` would be a `ReferenceError` the moment
    // `/login` renders. The SSR build therefore keeps Vite's default
    // `base`-relative URL — which is exactly what Razzle did, since
    // `DynamicPublicPathPlugin` was also applied to the client target only and
    // the node target built with `publicPath: '/'`. Server-rendered asset URLs
    // consequently ignore a sub-path `PUBLIC_URL` under both toolchains; the
    // client re-render (the app does not hydrate) immediately corrects them.
    ...(isSsrBuild
      ? {}
      : {
          experimental: {
            renderBuiltUrl: (filename, { hostType }) =>
              hostType === 'css'
                ? { relative: true }
                : // The helper lives next to `window.env` in `indexHtml.ts` so
                  // that PUBLIC_URL normalisation keeps one home
                  // (`src/common/urls.ts`) instead of being inlined into every
                  // chunk.
                  { runtime: `window.__assetUrl(${JSON.stringify(filename)})` },
          },
        }),

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
    // `buildType: 'iso'` uses webpack-node-externals — so keeping this list
    // short preserves today's behavior rather than changing it. See
    // `keepExternal`, which is what actually holds the line for the CJS
    // output.
    ssr: {
      noExternal: ssrBundled,
    },

    build: {
      // False in *both* builds, and non-negotiable in the server one: its
      // `outDir` is `build/`, the **parent** of the client's `build/public/`,
      // so the default `true` would delete the client output that was just
      // written. The clean slate comes from the `rimraf build` that runs
      // before both builds instead (see `package.json`).
      emptyOutDir: false,
      sourcemap: true,
      // Matches the existing `static/*` 404 rule in `server.ts`. Set for both
      // builds — see `assetFileNames` below.
      assetsDir: 'static',
      // For xlsx's UMD build.
      commonjsOptions: { transformMixedEsModules: true },
      ...(isSsrBuild
        ? {
            // `build/server.js` — exactly where the Dockerfile's
            // `CMD ["yarn","node","build/server.js"]` expects it, and what
            // makes `server.ts`'s `path.resolve(__dirname, 'public')` point at
            // the client output.
            outDir: 'build',
            ssr: serverEntry,
            // `public/` is the *client* build's job. Copying it here too
            // would scatter a second favicon.ico and images/ into `build/`.
            copyPublicDir: false,
          }
        : {
            outDir: 'build/public',
            copyPublicDir: true,
            // Both are consumed by `src/server/assets.ts`.
            manifest: true,
            ssrManifest: true,
          }),
      rollupOptions: {
        input: isSsrBuild ? serverEntryPath : { client: clientEntry },
        // Rollup asks this before any resolver runs, which is the only place
        // that can stop Vite rewriting a bare specifier — see `keepExternal`.
        ...(isSsrBuild ? { external: keepExternal } : {}),
        output: isSsrBuild
          ? {
              // CJS, not Vite's ESM default for SSR builds: `package.json` has
              // no `"type": "module"`, so Node parses `build/server.js` as
              // CommonJS and an ESM bundle would crash on its first `import`.
              // CJS also keeps `__dirname` alive — `server.ts`'s `PUBLIC_DIR`
              // and `index.ts`'s manifest paths both need it — and keeps
              // `source-map-support/register` working, leaving the Dockerfile
              // `CMD` and the JetBrains run configs untouched.
              format: 'cjs',
              // Rollup's default, `'default'`, assumes every external is plain
              // CommonJS whose `module.exports` *is* the default export, and
              // emits a bare `require()` with no interop check. That is wrong
              // for the many dependencies here that ship a Babel-style CJS
              // build (`exports.default` plus `__esModule`): `@emotion/cache`
              // came out as `baseEmotionCache is not a function`. `'auto'`
              // emits the `__esModule` check instead — the same interop webpack
              // applied, so the whole dep graph keeps behaving as it does today.
              interop: 'auto',
              entryFileNames: 'server.js',
              // The one asset import in the graph (AuthLayout's
              // background.png) is reachable from SSR too, so its *name* has
              // to be computed the same way here as in the client build or the
              // server-rendered `<img src>` points at a file that was never
              // written. `build.ssrEmitAssets` stays at its default `false`,
              // so this names a URL rather than emitting a second copy; the
              // hash is content-derived, so the two agree.
              assetFileNames: 'static/[name].[hash][extname]',
              // Deliberately NOT `inlineDynamicImports`, despite today's
              // `LimitChunkCountPlugin(1)` producing a single file. The two are
              // not equivalent: webpack's one file still holds one *function*
              // per module and runs it on first `__webpack_require__`, so a
              // dynamic import stayed lazy. Rollup's inlining concatenates
              // module bodies and hoists every external `require` to the top of
              // the file, so `loadable(..., { ssr: false })` chunks — which the
              // server must never execute — run at startup instead:
              //
              //     @editorjs/delimiter/dist/bundle.js:1
              //     ReferenceError: window is not defined
              //
              // Splitting restores webpack's laziness. Nothing fetches these
              // over HTTP, so their names only need to be stable and out of the
              // way; `build/public/` is the only directory Express serves.
              chunkFileNames: 'chunks/[name].[hash].js',
            }
          : {
              entryFileNames: 'static/[name].[hash].js',
              chunkFileNames: 'static/[name].[hash].js',
              assetFileNames: 'static/[name].[hash][extname]',
              // Do NOT add `experimentalMinChunkSize`: Rollup would merge
              // chunks out of the manifest and `assets.ts` could no longer
              // find them.
            },
        // `CircularDependencyPlugin` runs with `failOnError: true` today,
        // which means real cycles exist in this codebase and are being
        // actively held back. Rollup only warns, so without this the guard is
        // silently lost and SSR module-init-order bugs become possible.
        // Server build only, with the same exclusions Razzle's
        // CircularDependencyPlugin had.
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
