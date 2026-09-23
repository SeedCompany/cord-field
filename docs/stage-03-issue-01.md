---
title: 'Add vite.config.ts'
stage: 3
issue: 1
status: done
type: feature
depends_on: [stage-00-issue-01, stage-01-issue-05, stage-01-issue-08]
---

# Add `vite.config.ts`

## Context

Add the Vite config **alongside Razzle, wired to nothing**. Razzle stays the real
build, so `vite build` output can be diffed against it by hand before anything
depends on it.

**Target Vite 7 with `@vitejs/plugin-react@5`**, not Vite 8. `plugin-react` v6
drops the `babel` option, and this repo needs Babel for two things it cannot get
elsewhere: `@emotion/babel-plugin` (deterministic class-name labels — lose it and
SSR and client class names diverge) and the `loadableId` plugin. `plugin-react@5`
peers on Vite `^4.2 || ^5 || ^6 || ^7 || ^8`, so the Vite 8 upgrade stays open as
a small follow-up rather than being bundled into this migration.

## Task

### Resolution

- `resolve.alias` `~` → `src`. Prefer the hand-written alias over
  `vite-tsconfig-paths`: [`tsconfig.json`](../tsconfig.json) also maps
  `"*": ["./typings/*"]`, which would make the plugin try resolving *every* bare
  specifier against `typings/`. That mapping is TS-only and should stay that way.
- `resolve.dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled', '@emotion/cache']`.
  Two Emotion instances silently produce two style registries, breaking
  `createMuiEmotionCache` / `TssCacheProvider`.
- The `graphqlTs()` plugin (`enforce: 'pre'`) mapping `*.graphql` →
  `*.graphql.ts`, shared with `vitest.config.ts` via `vite/plugins.ts`. It must
  **fall back gracefully** — two `.graphql` files have no generated sibling
  (`client-schema.graphql`, read via `fs` at codegen time, and an empty
  `ToolListItem.graphql`). `enforce: 'pre'` is required or `vite:resolve` finds
  the real `.graphql` text file and hands it to a loader that doesn't exist.
  Temporary: `stage-05-issue-01` deletes it.
- Drop the `@seedcompany/common` → `index.js` alias; Vite honours the package's
  `exports` map. Add it to `ssr.noExternal` instead if SSR picks the wrong
  condition.

### Defines

- **Do not add `define: { 'process.env': 'window.env' }`.**
  `stage-00-issue-01` settled this: on Vite 7.3.6 the member-chain prefix
  rewrite works in `vite build` but **not** in `vite dev`, where only exact
  dotted keys are substituted. Dev would ship `process.env.PUBLIC_URL` to the
  browser and throw `ReferenceError: process is not defined`. The runtime-env
  reads go through the `src/common/env.ts` accessor instead — landed in Stage 1
  by `stage-01-issue-08.md`, so it already exists by the time this config is
  written.
- `'process.env.MUI_X_LICENSE_KEY'` and, in prod, `__DEV__: 'false'` (Apollo 3.4+).
  Both are exact keys, squarely within documented `define` behavior, and both
  verified unaffected by the spike.
- `process.env.NODE_ENV` needs **no** entry. Vite defines it itself in both dev
  and build, and the spike confirmed it resolves to a plain string literal
  (`"production"` / `"development"`) either way. The ~8 `NODE_ENV` comparison
  sites in `src/` are therefore left alone by the accessor codemod.

### Assets and the runtime public path

`experimental.renderBuiltUrl` reproduces `DynamicPublicPathPlugin`, resolving
asset URLs from `window.env.PUBLIC_URL` at runtime.

This is viable **because** the repo has zero CSS files in `src/` and exactly one
asset import
([`AuthLayout.tsx`](../src/scenes/Authentication/AuthLayout.tsx)'s
`background.png`) — so every rewritable reference is JS-hosted.
`renderBuiltUrl`'s `{ runtime }` form cannot rewrite `url()` inside emitted CSS,
which would otherwise be a blocker.

Emit the prefix through a small `window.__assetUrl` helper defined next to
`window.env` in `indexHtml.ts`, rather than inlining the concatenation —
`PUBLIC_URL` normalisation (trailing slash, sub-path vs full origin) already lives
in `src/common/urls.ts` and should have one home.

*Simpler alternative worth spiking if `renderBuiltUrl` misses something*:
`base: './'`, which resolves chunk URLs against `import.meta.url` and is
deployment-path-agnostic with no helper at all. Bigger semantic departure, so try
`renderBuiltUrl` first.

### Manifests

`build.manifest: true` **and** `build.ssrManifest: true` — `assets.ts` consumes
both. Do **not** set `build.rollupOptions.output.experimentalMinChunkSize`; Rollup
would merge chunks out of the manifest and they'd become unfindable.

### Dependency handling

- `optimizeDeps.include` for the heavy barrels: `@mui/material`,
  `@mui/material/styles`, `@mui/icons-material`, `@mui/lab`, `@mui/system`,
  `@mui/base`, `@mui/x-data-grid-pro`, `@mui/x-date-pickers`, `@mui/x-tree-view`,
  `lodash`, `luxon`, `@apollo/client`, `react-dnd`, `reactflow`. This — not a
  Babel transform — is the right fix for dev cold start.
- **Alias `lodash` → `lodash-es`**, and add `lodash-es` to `ssr.noExternal`.
  `lodash` is CommonJS, so `import { pick } from 'lodash'` does **not** tree-shake
  under Rollup; today `babel-plugin-transform-imports` hides this by rewriting to
  `lodash/pick`. Dropping that plugin without the alias silently adds ~25 KB gz.
  The alias keeps all 91 import sites and the `@types/lodash` types unchanged.
- `vite-plugin-node-polyfills`, **client-only**, with an explicit allowlist:
  `buffer`, `stream`, `util`, `events`, `process`, `path`, plus
  `globals: { Buffer: true, global: true, process: true }` and
  `define: { global: 'globalThis' }`. Keep it narrow — shimming `fs`/`crypto`/`http`
  wholesale would mask real mistakes. Also
  `build.commonjsOptions.transformMixedEsModules: true` for `xlsx`'s UMD build.

### Circular dependencies

`rollupOptions.onwarn` throwing on `CIRCULAR_DEPENDENCY`, excluding
`node_modules` and `src/components/files`, on the **server build only** — matching
what [`razzle.config.js`](../razzle.config.js) does today.

This matters: `CircularDependencyPlugin` is configured with `failOnError: true`,
which means **real cycles exist in this codebase and are being actively held
back**. Rollup only warns by default, so without this the guard is silently lost
and SSR module-init-order bugs become possible.

### Don't forget

`require('./config/loadDotenv.cjs')` at the top of the config — see
`stage-01-issue-05.md`. Without it, dev `clientEnv` is built from an unpopulated
`process.env` and every GraphQL call in dev targets the wrong host.

## Definition of done

- `yarn vite build` produces output (not yet wired into `yarn build`).
- Client bundle size is within a few percent of Razzle's; a ~25 KB gz jump means
  the lodash alias didn't take.
- `grep -l 'readable-stream' build/public/static/client.*.js` is empty —
  polyfills belong only in lazy chunks.
- Razzle's `yarn build` and `yarn start` still work.
