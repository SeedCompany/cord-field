---
title: 'Produce the production build with Vite'
stage: 3
issue: 3
status: open
type: feature
depends_on: [stage-03-issue-01, stage-02-issue-04]
---

# Produce the production build with Vite

## Context

Two `vite build` invocations must reproduce Razzle's exact output contract:
`build/server.js` plus `build/public/`. The [`Dockerfile`](../Dockerfile)'s
`CMD ["yarn","node","build/server.js"]` and `express.static(PUBLIC_DIR)` in
[`src/server/server.ts`](../src/server/server.ts) both depend on it, and neither
should need to change.

`src/server/server.ts` resolves
`path.resolve(__dirname, 'production' ? '.' : '..', 'public')` — so with
`server.js` at `build/server.js`, client output must land at `build/public/`.

## Task

```json
"build:client": "vite build",
"build:server": "vite build --ssr",
"build": "yarn gql-gen && rimraf build && yarn build:client && yarn build:server"
```

**Order matters.** Client first (writes `build/public/`), server second. The
explicit `rimraf build` up front replaces what `emptyOutDir` was doing.

### Client build

`outDir: 'build/public'`, `assetsDir: 'static'` (matches the existing `static/*`
404 rule), `emptyOutDir: false`, `manifest: true`, `ssrManifest: true`,
`copyPublicDir: true`, `sourcemap: true`,
`rollupOptions.input: { client: 'src/client.tsx' }`.

### Server build

`outDir: 'build'`, `ssr: 'src/index.ts'`, `copyPublicDir: false`,
`entryFileNames: 'server.js'`, `inlineDynamicImports: true` (matching today's
`LimitChunkCountPlugin(1)`).

**`emptyOutDir: false` is non-negotiable.** The server's `outDir` is `build/`, the
*parent* of `build/public/` — with the default `emptyOutDir: true` it would delete
the client output that was just written.

### Output must be CJS

`format: 'cjs'`. Vite's SSR builds default to ESM, but
[`package.json`](../package.json) has no `"type": "module"`, so an ESM
`build/server.js` would be parsed as CJS and crash. CJS keeps `__dirname` in
`server.ts` working, keeps `source-map-support/register` working, and leaves the
Dockerfile `CMD` and the JetBrains run configs untouched.

The honest risk: an **ESM-only external** being `require()`d. Today's webpack
build proves the current dep graph is CJS-requireable, and Vite's SSR resolution
uses the `node`/`require` conditions, so this is unlikely — and the fix is one
line in `ssr.noExternal`.

### Leave `ssr.noExternal` at its default

Deps stay external. This **preserves** today's behavior rather than changing it:
Razzle's `buildType: 'iso'` already applies `webpack-node-externals`, and
`LimitChunkCountPlugin` only collapses *app* code. The Dockerfile already installs
prod deps at runtime. Bundling everything instead would be slower and would break
packages that do dynamic `require()` or read their own `__dirname`.

Add entries only as SSR errors actually surface — expect one or two.

### Plug a new leak

`express.static` defaults to `dotfiles: 'ignore'`, so `/.vite/manifest.json` won't
be served — but it will **fall through to the SSR renderer and return a 200 HTML
page** instead of a 404. Extend the existing 404 rule in `server.ts`:

```ts
router.use(['static/*', 'images/*', '.vite/*'], (req, res) => res.sendStatus(404));
```

### Manifest paths to the server

Pass `manifest.json` / `ssr-manifest.json` locations to `assets.ts` via env vars,
mirroring today's `LOADABLE_STATS_MANIFEST` define. Names must match what
`stage-02-issue-04` implemented.

## Expected output layout

```
build/
  server.js                    ← Dockerfile CMD unchanged
  server.js.map
  public/
    static/client.<hash>.js    ← express.static unchanged
    static/<chunk>.<hash>.js
    static/background.<hash>.png
    .vite/manifest.json
    .vite/ssr-manifest.json
    favicon.ico
    site.webmanifest
    images/**
    pdfs/**
```

## Definition of done

- The layout above is produced exactly.
- `node build/server.js` boots and serves.
- `jq 'keys' build/public/.vite/ssr-manifest.json` contains
  `src/scenes/Partners/index.ts` — the assumption `assets.ts` rests on.
- **SSR parity**: capture Razzle baselines for `/`, `/projects`, `/login`, a
  redirect and a 404; diff against Vite output with hashes normalised
  (`sed -E 's/[0-9a-f]{8,}/H/g'`). Tag *form* will differ. **Blocking if
  different**: Emotion class names, or markup volume on a data-heavy route.
- **Sub-path deploy**: `PUBLIC_URL=http://localhost:4000/app node build/server.js`,
  then confirm `<base href>` is right, `/app/static/*` returns 200, and lazy
  chunks fetch from `/app/static/` rather than `/static/`.
- `/.vite/manifest.json` returns 404, not HTML.
