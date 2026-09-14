---
title: 'Emit SSR asset tags from Vite manifests'
stage: 2
issue: 4
status: open
type: feature
depends_on: [stage-02-issue-03]
---

# Emit SSR asset tags from Vite manifests

## Context

[`src/server/indexHtml.ts`](../src/server/indexHtml.ts) currently takes a
`ChunkExtractor` and calls `getLinkTags()`, `getStyleTags()` and
`getScriptTags()`. With `@loadable` gone, those tags must come from Vite's
manifests instead.

Putting this behind a plain data seam — rather than swapping one library object
for another — also means `indexHtml.ts` stops knowing anything about the bundler.

## Task

### `src/server/assets.ts` (new)

Export a plain shape and a builder:

```ts
export interface RenderedAssets {
  /** goes in <head> */
  links: string;
  /** goes at the end of <body> */
  scripts: string;
}

export const renderAssets: (moduleIds: readonly string[]) => RenderedAssets;
```

- **Dev**: return `/@vite/client` plus the raw entry
  (`<script type="module" src="/src/client.tsx">`). Vite handles the rest.
- **Prod**: read `manifest.json` (entry chunk, its CSS, its transitive imports as
  `modulepreload`) and `ssr-manifest.json` (assets for each rendered module id).
  Emit `<link rel="stylesheet">` for `.css`, `<link rel="modulepreload">` for JS,
  `<link rel="preload" as="font">` for fonts.

**`PUBLIC_URL` must be applied here at render time**, not baked into the manifest
— exactly what `ChunkExtractor`'s `publicPath` option was doing. Manifest paths
are relative to the build; the runtime prefix is per-deployment.

Manifest paths reach the server via env vars (mirroring today's
`LOADABLE_STATS_MANIFEST` define) — agree the names with `stage-03-issue-03`.

### `renderServerSideApp.tsx`

- Replace `ChunkExtractor` with `ChunkCollector`.
- `await whenLoadablesSettle()` **before** rendering, so lazy components resolve
  synchronously during `renderToString`.
- Wrap a **bounded outer retry loop** (max 3 passes) around `getMarkupFromTree`,
  re-settling between passes, with a dev warning if it gives up.

  This loop is **required, not defensive**: `getMarkupFromTree` only re-renders
  for *Apollo* promises — verified in
  `@apollo/client/react/ssr/getDataFromTree.js`, which does
  `renderPromises.hasPromises() ? consumeAndAwaitPromises().then(process) : html`.
  It will not loop for module resolution. In steady state this runs exactly once.
- Add `__LOADABLE_IDS__: collector.ids` to the `globals` object so the client can
  preload what the server rendered.
- Pass `assets: renderAssets(collector.ids)` to `indexHtml`.

### `indexHtml.ts`

```diff
-  ${extractor.getLinkTags()}
+  ${assets.links}
   ${helmet.link.toString()}
-  ${extractor.getStyleTags()}
   ${helmet.style.toString()}
...
-  ${extractor.getScriptTags()}
+  ${assets.scripts}
```

`getStyleTags()` folds into `assets.links` — `.css` entries render as
`<link rel="stylesheet">`.

### Deps

Remove `@loadable/component`, `@loadable/server`, `@loadable/babel-plugin`,
`@loadable/webpack-plugin`, the three `@types/loadable__*`, and the
`@loadable/babel-plugin` `packageExtensions` entry in [`.yarnrc.yml`](../.yarnrc.yml).

## Verify the manifest key format before merging

The `ssrManifest` key format is assumed, not verified. Run the client build and
check:

```bash
jq 'keys' build/public/.vite/ssr-manifest.json | head -40
```

Confirm `src/scenes/Partners/index.ts` appears as a key whose value contains the
Partners chunk. If keys are `/`-prefixed, or values are keyed by *importer* rather
than *importee*, **only `assets.ts` changes** — and the app is still correct
without it, since it never hydrates. You lose preload hints, not behavior.

## Definition of done

- SSR HTML contains stylesheet + modulepreload tags for the route's chunks.
- Diff the rendered `<head>` against a Razzle baseline for `/`, `/projects`,
  `/login` with content hashes normalised. Tag *form* will differ; the set of
  referenced chunks should not.
- No FOUC on the Workflow route in production (it imports
  `reactflow/dist/style.css`). Dev FOUC there is expected and acceptable.
- `grep -rn "@loadable" .` returns nothing outside the lockfile.
