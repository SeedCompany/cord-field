---
title: 'Add the loadableId Babel plugin'
stage: 2
issue: 2
status: done
type: feature
depends_on: [stage-02-issue-01]
---

# Add the `loadableId` Babel plugin

## Context

The `Loadable` module keys its registry by module id, and the server needs that
same id to look chunks up in Vite's `ssr-manifest.json`. Writing ids by hand at
~30 call sites would be noise that drifts.

`@loadable/babel-plugin` did this job for webpack. This is its replacement.

## Why Babel rather than a Vite/Rollup transform

- **The ids must be byte-identical in the client build and the SSR build**, or
  `loadableReady`'s registry lookup silently finds nothing. Babel is the one
  transform that runs in both, identically. Two separate code paths would not
  guarantee it.
- A Rollup-style `transform` plugin needs the code *after* TS/JSX stripping to
  use `this.parse` — acorn cannot read TSX — and ordering it reliably against
  `vite:esbuild`/`plugin-react` inside the same phase is fragile.
- Babel is already on the hot path for `@emotion/babel-plugin`, so the marginal
  cost is ~zero.

**The hand-compiled `.js` twin problem does not recur here.** `vite.config.ts` is
bundled by esbuild before execution, *including its relative imports*, so
`import { loadableId } from './vite/babel/loadableId'` compiles the TypeScript for
free. Write it as `.ts`, keep it dependency-light, no twin. (The same trick would
have rescued `disableSsrByDefault` — see `stage-01-issue-04.md`, which deletes it.)

## Task

Add `vite/babel/loadableId.ts`. It must:

- Track the **local binding name** of `loadable` per file (it may be imported as
  a default or named import, and the file may alias it).
- Match both `loadable(...)` and `loadable.lib(...)`.
- Recognise the `() => import('X')` argument shape and extract `'X'`.
- Resolve `'X'` synchronously against the importer — handling relative (`./List`)
  and `~/`-aliased specifiers, trying `.tsx/.ts/.jsx/.js/.mjs/.cjs` then
  `index.*`. **Skip bare package specifiers** (`react-editor-js`) — they have no
  manifest key.
- Inject `id: '<root-relative posix path>'` into the options object, creating one
  if absent, and **skip if an `id` is already present**.

Babel plugins cannot resolve asynchronously — and here they do not need to, since
every specifier at every call site is either relative or a bare package name.

Wire it in alongside the Emotion plugin:

```ts
react({
  jsxImportSource: '@emotion/react',
  babel: {
    plugins: ['@emotion/babel-plugin', [loadableId, { root: __dirname }]],
  },
})
```

`src/components/Loadable/loadable.tsx` should `console.warn` in development when a
call site arrives without an `id`, so a mis-wired plugin is loud rather than a
silent performance regression.

## Definition of done

- Unit tests for the transform: default vs named import, aliased binding,
  `.lib` form, existing-`id` passthrough, bare-specifier skip, `index.ts`
  directory resolution.
- Ids are root-relative and posix-separated (e.g. `src/scenes/Partners/index.ts`),
  matching the format Vite's `ssrManifest` keys on.
- Still green under Razzle — the plugin is inert until Stage 3 wires Vite up.
