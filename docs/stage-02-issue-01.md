---
title: 'Add the Loadable module'
stage: 2
issue: 1
status: open
type: feature
---

# Add the Loadable module

## Context

`@loadable/component` is webpack-only: `@loadable/babel-plugin` emits metadata
keyed to `require.resolveWeak`, `@loadable/webpack-plugin` emits
`loadable-stats.json`, and `@loadable/server`'s `ChunkExtractor` reads that stats
file. None of it has a Vite equivalent, so it must be replaced.

### Why a hand-rolled wrapper rather than `vite-preload` or bare `React.lazy`

`vite-preload` is a well-matched, maintained library that does most of this — but
its `lazy()` is built on `React.lazy`, which **suspends**. This codebase has
**exactly one `<Suspense>` boundary**
([`FilePreview.tsx:51`](../src/components/files/FilePreview/FilePreview.tsx#L51))
against ~30 loadable call sites. Adopting anything `React.lazy`-based means adding
~29 new Suspense boundaries and reasoning about fallback placement at every route.

A wrapper that renders a `fallback` prop directly — exactly what today's
`loadable` API does — keeps almost every call site to a one-line import change.

A second fact lowers the stakes further: **the app never hydrates**.
[`client.tsx:109`](../src/client.tsx#L109) calls `createRoot(root).render(...)`,
not `hydrateRoot`. So preloading is a first-paint optimization, not a correctness
requirement — getting the manifest wiring imperfect degrades performance, not
behavior.

## Task

New module at `src/components/Loadable/`, matching the repo's
folder-plus-`index.ts`-barrel convention.

### `loadable.tsx`

A factory over a module-level `Map<id, Holder>` registry shared by server and
client. Each holder tracks `status`/`module`/`promise` and exposes `load()`.

Requirements:

- **Renders `options.fallback` directly** while loading. No Suspense.
- **`resolveComponent`** supported, since the codebase bans default exports.
- **`loadable.lib`** attached via `Object.assign`, so
  [`RichTextField.tsx`](../src/components/RichText/RichTextField.tsx)'s two
  `loadable.lib(() => import(...), { ssr: false })` render-prop sites need **only
  an import-line change**. `.lib` yields the whole module to a children function.
- **`ssr: false`** honoured — renders the fallback and never imports on the server.
- **`.preload()`** exposed; `RichTextField` already calls `Lib.preload()` and
  `Tools.preload()`.
- **Holders deduped by id.** Two call sites can point at the same module —
  [`Engagements.tsx`](../src/scenes/Engagement/Engagements.tsx) imports
  `'../ProgressReports'` twice with different `resolveComponent`. One chunk, two
  components, one holder.
- **Server: fire the import at *definition* time.** Evaluating `Root.tsx` starts
  all 15 of its imports; resolving `'../Projects'` evaluates `Projects.tsx`, which
  registers and fires its own 9. The graph drains transitively.
- Export `hasPendingLoadables()` and `whenLoadablesSettle()` for the server. The
  latter loops (`while (pending.size) await Promise.allSettled([...pending])`)
  rather than awaiting once, because resolving a module registers more.

### `ChunkCollector.tsx`

A per-request React context recording which ids rendered. Shape it like the
existing `ServerLocation` collector in
[`src/components/Routing/Navigate.tsx`](../src/components/Routing/Navigate.tsx) so
it slots straight into `renderServerSideApp`'s `wrap()` chain.

**Accumulate across render passes — do not reset per pass.** Apollo's
`getMarkupFromTree` renders repeatedly; over-collection costs one preload hint,
under-collection costs a request waterfall.

### `loadableReady.ts`

Drop-in for `@loadable`'s. Reads `window.__LOADABLE_IDS__` (written by the server),
looks each id up in the registry, and loads them before the client renders.

**Must loop**, not run a single pass: an id for a nested loadable (e.g.
`ProjectOverview`, declared inside `Projects.tsx`) is not in the registry until
`Projects.tsx` itself evaluates. Keep going until a pass loads nothing new.

Deliberately, this **reads no manifest** — the server sends *source ids*, the
client looks them up and calls the registered `import()`, and Rollup's
`__vitePreload` inside that import already knows the real chunk URLs. A wrong
manifest costs preload hints, never correctness.

### `index.ts`

Barrel exporting `loadable`, `loadableReady`, `ChunkCollector`,
`ChunkCollectorContext`, `hasPendingLoadables`, `whenLoadablesSettle`.

## Scope

**This issue adds the module and its unit tests only. No call sites change.**
That keeps ~200 lines of new, unreferenced, independently-reviewable code out of
the diff that touches SSR.

## Definition of done

- Unit tests cover: resolve-on-client, `resolveComponent`, `ssr: false`,
  `.lib` render-prop, holder dedup by id, and the `whenLoadablesSettle` loop.
- Nothing imports the module yet.
- `yarn type-check && yarn lint:check && yarn test && yarn build` green under
  Razzle.
