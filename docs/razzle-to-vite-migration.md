# Migrating the build chain from Razzle to Vite

The tracked work for this migration lives alongside this document as
`stage-##-issue-##.md` files.

---

## Non-technical overview

The tool that assembles this app's code into something a browser can run — the
"build chain" — is a project called Razzle. Razzle is no longer maintained, and
the bundler underneath it (webpack 4) reached end of life some time ago. Nothing
is broken today, but the repo carries a growing pile of workarounds to keep it
running: patched copies of libraries, pinned versions, and a Node version we
can't upgrade.

This document plans the move to Vite, a modern, actively maintained replacement.

The important constraint is that **nothing about how the app behaves should
change**. The app renders pages on the server before sending them to the browser,
and it's built once into a single Docker image that gets configured differently
for each environment. Both of those properties are easy to break during a
migration and both must survive intact.

---

## Context

`cord-field` builds today with **Razzle 4.2.18 on webpack 4**. Razzle is
unmaintained and webpack 4 is end-of-life — that is the reason to move. The cost
of staying is visible throughout the repo: a patch against Razzle itself, a patch
against `css-minimizer-webpack-plugin`, `resolutions` pinning
`react-dev-utils`/`watchpack-chokidar2` transitives, Node pinned to 24.14.1, and
a list of `node_modules` force-transpiled because webpack 4 can't parse modern
syntax.

This is **not** a bundler swap. Razzle builds two bundles (`web` + `node`) for a
genuinely isomorphic app, so this is an SSR-framework migration. The goal is to
land on Vite with **identical runtime behavior**: same SSR output, same
one-image-many-environments deploy model, and the same `build/server.js` +
`build/public/` output contract that the Dockerfile and Express both depend on.

### Decisions

| Decision | Choice |
| --- | --- |
| SSR | **Keep.** Custom Vite SSR — Express + `ssrLoadModule` in dev, `vite build --ssr` in prod. No meta-framework. |
| Vite version | **Vite 7** + `@vitejs/plugin-react@5` (the Babel-based plugin). Vite 8/Rolldown is a separate follow-up. |
| `@loadable/component` | **Custom wrapper** in `src/components/Loadable/`. Not `vite-preload` — see finding 2. |
| Tests | **Vitest**, landed *early*, while Razzle still builds. |
| Yarn PnP | **Switch to `nodeLinker: node-modules`.** No spike — go straight to it. |
| `.graphql` imports | **Codemod** to `.graphql.ts`, deferred to the end, as a commit that changes nothing else. |
| Rollout | **One PR, atomic commits.** |

---

## What the current build actually does

Constraints verified in the repo:

- **No `index.html` exists.** HTML is a TypeScript template literal in
  [`src/server/indexHtml.ts`](../src/server/indexHtml.ts), assembled per request
  from `@loadable/server` tag getters, Emotion critical CSS, react-helmet-async
  tags, and a `window.env` globals script.
- **The runtime-env contract is load-bearing.**
  [`razzle.config.js`](../razzle.config.js) defines `process.env` → `window.env`
  on the client, and `forceRuntimeEnvVars` keeps `PUBLIC_URL` and
  `RAZZLE_API_BASE_URL` *out* of the build.
  [`src/server/renderServerSideApp.tsx`](../src/server/renderServerSideApp.tsx)
  serializes an allowlisted `clientEnv` into `window.env` per request. One image
  is built once and configured per environment at container start. This must
  survive — **no `VITE_`-prefixed vars, no `import.meta.env`, for anything
  environment-configurable.**
- **`PUBLIC_URL` resolves at runtime**, via `DynamicPublicPathPlugin` replacing a
  sentinel string with `window.env.PUBLIC_URL`. It drives `<base href>`, the
  router `basename`, and the asset path.
- **Rendering cannot stream.** Apollo's `getMarkupFromTree` does repeated
  `renderToString` passes, so `renderToPipeableStream` is unavailable.
- **Browser code pulls node-ish libs** — `mammoth`, `@iarna/rtf-to-html`,
  `@freiraum/msgreader`, `file-type@16`, `xlsx` — that webpack 4 auto-polyfilled.
  Vite polyfills nothing. All of them sit behind lazy previewer chunks, so **a
  green build proves nothing here** — they need manual testing.
- **`loadEnv.codegen.js` imports `razzle/config/env`**, so removing Razzle breaks
  `yarn gql-gen`, which `build` depends on. Hard ordering constraint.
- **Jest comes in transitively via Razzle** and its config is synthesized by
  `razzle test` + `modifyJestConfig`. Deleting Razzle breaks `yarn test`. This is
  why Vitest lands early.
- Dev runs **two processes on two ports** today: webpack-dev-server owns `PORT`,
  Express runs on `PORT+1`, and WDS proxies everything so the browser sees one
  origin.

---

## Findings that shaped the design

Each of these was verified directly, and each overturned an assumption worth
recording.

**1. The app never hydrates.**
[`src/client.tsx:109`](../src/client.tsx#L109) calls `createRoot(root).render(...)`,
not `hydrateRoot` — [`src/common/useIsMobile.ts:12`](../src/common/useIsMobile.ts#L12)
even comments on it. So hydration mismatch is not a risk, and chunk preloading is
a **first-paint optimization, not a correctness requirement**. This lowers the bar
on the whole loadable replacement. (It also means half the value of SSR is being
discarded today — worth raising with the team, out of scope here.)

**2. There is exactly one `<Suspense>` boundary in the codebase**
([`src/components/files/FilePreview/FilePreview.tsx:51`](../src/components/files/FilePreview/FilePreview.tsx#L51)).
`React.lazy` requires a Suspense boundary per call site — so anything built on it,
**including `vite-preload`**, means adding ~29 new boundaries. A custom wrapper
that renders a `fallback` prop directly (exactly today's `loadable` API) is a far
smaller and safer diff. **This is why the plan uses a hand-rolled wrapper rather
than `vite-preload`.**

**3. Apollo's `defaultOptions` cannot replace the `disableSsrByDefault` Babel
plugin.** In `@apollo/client@3.14`, `useQuery.js:156` reads `ssr` straight off the
hook's own options (`options.ssr !== false && !options.skip`), and `ssr` is
`__rest`-excluded before `client.defaultOptions.watchQuery` is ever merged.
Instead: export a `useQuery` from `~/api` that defaults `ssr: false`, and add an
auto-fixable restricted-import rule. The repo already uses exactly this pattern in
[`.eslintrc.js`](../.eslintrc.js) (`react-router` → `react-router-dom`,
`@mui/material` `styled` → `@mui/material/styles`), so `eslint --fix` does the
codemod and lint keeps it true.

**4. The `.graphql` → `.graphql.ts` codemod needs one tsconfig flag.** Bare
`import … from './Foo.graphql.ts'` fails with `TS5097`; adding
**`allowImportingTsExtensions: true`** makes it clean. Verified against this
repo's exact settings (`moduleResolution: node`, `noEmit: true` — the flag
requires `noEmit`, which is already set).

**5. Dropping `babel-plugin-transform-imports` is a real prod regression for
lodash.** `lodash` is CommonJS, so `import { pick } from 'lodash'` does **not**
tree-shake under Rollup — you'd silently ship the whole library (~25 KB gz). Today
the Babel plugin rewrites it to `lodash/pick`. Fix by aliasing `lodash` →
`lodash-es`, which keeps all 91 import sites and the `@types/lodash` types
unchanged. The MUI half of the plugin can just be dropped (Rollup tree-shakes
MUI's ESM fine); dev cold-start is handled by `optimizeDeps.include`, not a
transform.

**6. Razzle does *not* bundle node_modules into the server.** `buildType: 'iso'`
uses `webpack-node-externals`. So `ssr.noExternal` left at its default (deps
external) *preserves* today's behavior rather than changing it — and the
Dockerfile already ships prod deps.

**7. Two pre-existing bugs to fix while we're here.** The Dockerfile's
`RUN echo RAZZLE_GIT_HASH=$GIT_HASH >> .env` writes a file nothing reads at
runtime (`setupEnvironment` is CLI-only), so `RAZZLE_GIT_HASH` is already
`undefined` in production — replace with real `ENV` instructions. And
`@emotion/jest`'s snapshot serializer is configured but there are zero snapshot
tests in the repo.

---

## Stage 0 — Spike

One assumption underpinned Stage 3 and had to be settled before building on it:
whether Vite's `define` rewrites the prefix of a member chain, so
`define: { 'process.env': 'window.env' }` turns `process.env.FOO` into
`window.env.FOO`. See `stage-00-issue-01.md`.

**Answered: it does not.** On Vite 7.3.6 the prefix rewrite works in
`vite build` but not in `vite dev`, where only exact dotted keys are
substituted. So the plan takes the documented fallback — an explicit
`src/common/env.ts` accessor plus a 13-site codemod, added to Stage 1 as item 8.

## Stage 1 — Prep that lands under Razzle

Pure refactors. The app keeps building and testing with Razzle at every commit,
which is what keeps the PR reviewable. These are independently mergeable — if the
team will take a pre-PR, ship them first and the migration PR shrinks a lot.

1. Delete the unused `serviceWorker`.
2. Delete the 75 orphaned `.stories.tsx` files.
3. Switch Yarn to the `node-modules` linker.
4. Replace `disableSsrByDefault` with an explicit `useQuery`.
5. Load dotenv without Razzle.
6. Give `Previewers` explicit `resolveComponent`.
7. Migrate Jest to Vitest.
8. Replace client `process.env` reads with an `env` accessor (added by the
   Stage 0 result).

**Landing Vitest here is the highest-leverage ordering decision in the plan** —
every commit after this one is validated by a real test suite instead of by hope.

## Stage 2 — The Loadable replacement

Build it, test it, then move the call sites. New module at
`src/components/Loadable/`:

- **`loadable.tsx`** — factory plus a module-level `Map<id, Holder>` registry.
  Renders a `fallback` prop directly rather than suspending, so no new Suspense
  boundaries. Exposes `loadable.lib` so
  [`src/components/RichText/RichTextField.tsx`](../src/components/RichText/RichTextField.tsx)'s
  two `loadable.lib(..., { ssr: false })` render-prop sites need **only an
  import-line change**.
- **`ChunkCollector.tsx`** — per-request context recording which ids rendered.
  Shaped like the existing `ServerLocation` collector so it slots into
  `renderServerSideApp`'s `wrap()` chain. Accumulates across Apollo's repeated
  render passes rather than resetting.
- **`loadableReady.ts`** — drop-in for `@loadable`'s, reading
  `window.__LOADABLE_IDS__`. `client.tsx` keeps `setup.push(loadableReady())`
  verbatim.

**Server-side resolution.** Truly synchronous resolution at render time is
impossible (`import()` is async, `renderToString` is not). Instead resolve
everything *before* rendering: on the server, `loadable()` fires its import at
**definition** time, so evaluating `Root.tsx` drains the graph transitively;
`renderServerSideApp` then `await`s a settle loop before rendering. This is not a
regression — webpack's server bundle already inlines every chunk and resolves them
with `requireSync`. A bounded retry loop (max 3 passes, dev warning) covers the
cold/HMR edge, and is needed regardless because `getMarkupFromTree` only
re-renders for *Apollo* promises.

**Chunk ids** come from a small Babel plugin (`vite/babel/loadableId.ts`) that
injects the resolved root-relative module id at each call site — the same key
format Vite's `--ssrManifest` uses. Babel rather than a Rollup transform because
the ids must be **identical in the client and SSR builds**, and Babel is the one
transform that runs in both. It is written as `.ts` and imported by
`vite.config.ts`, which esbuild compiles on load — so no hand-compiled `.js` twin
this time.

**Server tag generation** moves to a new `src/server/assets.ts` exposing a plain
`{ links, scripts }` object, so `indexHtml.ts` stops depending on `ChunkExtractor`.
Prod reads Vite's `manifest.json` + `ssr-manifest.json`; dev emits `/@vite/client`
plus the raw entry.

## Stage 3 — Introduce Vite

8. `vite.config.ts`, alongside Razzle and wired to nothing yet.
9. The Vite SSR dev server.
10. The production build.

## Stage 4 — Cut over and delete Razzle

11. Cut scripts, CI and the Dockerfile over together.
12. Delete Razzle and webpack.
13. Add the bundle analyzer.

## Stage 5 — The `.graphql` codemod

14. Isolated commit, last, once everything else is green.

---

## Deferred — do not bundle in

- **Vite 8 / Rolldown.** `@vitejs/plugin-react` v6 drops the Babel option we
  depend on for Emotion and `loadableId`, and Rolldown's Rust resolver has its own
  constraints. Separate, small PR later.
- **`RAZZLE_*` → `APP_*`/`VITE_*` env renaming.** Zero-risk follow-up; pointless
  churn here.
- **Replacing the node-dependent preview libs** (`mammoth`, `rtf-to-html`,
  `file-type`) rather than polyfilling — correct long-term, five independent
  library evaluations, out of scope.
- **The eslint rules tied to `transform-imports`.** The `@mui/material/*` and
  `lodash/*` deep-import bans stay *correct* (Vite's prebundling actively wants the
  barrel). Only the comment on the `styled`/`useTheme` rule — "our babel import
  transforms don't work with these exports" — becomes a lie. Reword it; don't
  delete the rule.

---

## Verification

Per stage, not just at the end.

- **Stage 1**: `yarn gql-gen -e && yarn type-check && yarn lint:check && yarn test
  && yarn build` green at every commit, still under Razzle. After the linker
  switch, `rm -rf node_modules .pnp.* && yarn install --immutable` then a full
  `docker build` + `docker run`, confirming `yarn workspaces focus --production`
  still prunes.
- **Stage 2**: load a route behind each converted call site (Projects,
  Engagements, a file preview, the rich-text editor) and confirm no fallback flash
  on a server-rendered load. Diff the SSR HTML head before/after for the same URL.
- **Stage 3**: `yarn dev` binds exactly one port (`lsof -i :3002` empty). Editing
  `src/server/server.ts` changes behavior without a restart — that's the
  `module.hot` replacement test. Editing a deep component
  (`src/components/Nest.tsx`) also changes SSR markup, which is the case today's
  `module.hot.accept('./server/server')` gets *wrong*. Fast Refresh preserves
  state.
- **SSR parity (the important one)**: capture baselines from the Razzle build for
  `/`, `/projects`, `/login`, a redirect and a 404; rebuild with Vite and diff with
  content hashes normalized (`sed -E 's/[0-9a-f]{8,}/H/g'`). Script/link tag *form*
  will differ. **Blocking if different**: Emotion class names (means
  `@emotion/babel-plugin` isn't running) or markup volume on a data-heavy route
  (means the `ssr: false` default isn't applying).
- **Runtime-env parity (the highest-risk check)**: build **once**, then run that
  same artifact with different `RAZZLE_API_BASE_URL` and `PUBLIC_URL` and confirm
  both take effect without a rebuild — including lazy chunks fetching from the
  `PUBLIC_URL` base and the router respecting a non-root `BASE_PATH`. Also confirm
  `RAZZLE_GIT_HASH` now actually appears in `window.env` (today it does not).
- **File previewers — manual, no substitute**: upload and open one each of `.csv`,
  `.docx`, `.xlsx`, `.rtf`, `.msg`, `.pdf`, `.txt` and an image, watching for
  `Buffer/process/global is not defined`. These all live in lazy chunks a build
  never executes.
- **Bundle size**: compare client bytes before/after. A ~25 KB gz jump means the
  lodash alias didn't take; `grep -l 'readable-stream' build/public/static/client.*.js`
  must be empty (polyfills belong only in lazy chunks).
- **Stage 4**: full CI green; `docker build` + `docker run` serves;
  `/static/nope.js` and `/.vite/manifest.json` both 404 rather than returning HTML.
- **Stage 5**: `yarn type-check && yarn build`, then `yarn clean && yarn gql-gen`
  and confirm regenerated files' imports match the codemod.

---

## Open risks

- ~~**`define: { 'process.env': 'window.env' }`**~~ — **closed.**
  `stage-00-issue-01.md` measured it: the prefix rewrite works in `vite build`
  and silently does nothing in `vite dev`. The plan now uses the `env` accessor
  fallback (`stage-01-issue-08.md`), which works identically under both
  toolchains.
- **Vite's `ssrManifest` key format** — verify against a real build. Degrades to
  "no preload hints", not to incorrectness.
- **`ssr.noExternal` completeness** — expect one or two additions once the SSR
  bundle first boots. Each is a one-line fix.
- **Which node polyfills the preview libs actually need** under Rollup vs what
  webpack 4 supplied. The manual previewer test is the only real gate.
