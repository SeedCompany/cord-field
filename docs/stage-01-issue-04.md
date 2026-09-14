---
title: 'Replace the disableSsrByDefault Babel plugin with an explicit useQuery'
stage: 1
issue: 4
status: open
type: refactor
---

# Replace `disableSsrByDefault` with an explicit `useQuery`

## Context

[`src/server/disableSsrByDefault.ts`](../src/server/disableSsrByDefault.ts) is a
hand-written Babel plugin that rewrites **every** `useQuery(...)` imported from
`@apollo/client` to inject `{ ssr: false }` unless the call already sets it. It
ships with a hand-compiled `.js` twin (`disableSsrByDefault.js`) because Babel
loads the plugin before TypeScript is available — a maintenance trap in its own
right.

This is load-bearing behavior, not an optimization: delete the plugin naively and
all 36 `useQuery` call sites start fetching during SSR.

It is also buying very little. **Exactly one call site opts back in** —
[`src/components/Session/Session.tsx:19`](../src/components/Session/Session.tsx#L19) —
out of 36. The cost is a compiled-JS twin, `@babel/types` as a devDep, and a
permanently non-obvious mental model where `useQuery(FooDocument)` in source does
not behave like `useQuery(FooDocument)` in the library.

## Why not Apollo's `defaultOptions`

Verified against the installed `@apollo/client@3.14` rather than assumed:

- `react/hooks/useQuery.js:156` — `var ssrAllowed = options.ssr !== false && !options.skip;`
  reads `options`, the raw second argument to the hook.
- `createMakeWatchQueryOptions` destructures `ssr` **out** via `__rest` before
  anything merges.
- `getObsQueryOptions` is the only place `client.defaultOptions.watchQuery` is
  merged, and it operates on options `ssr` was already removed from.

So `defaultOptions: { watchQuery: { ssr: false } }` is **silently ignored**. It is
not an option.

## Task

Add an app-owned wrapper:

```ts
// src/api/client/useQuery.ts
import { useQuery as useApolloQuery } from '@apollo/client';

/**
 * Apollo's `useQuery`, defaulted to NOT run during server-side rendering.
 *
 * Pass `ssr: true` to opt a query into the server render — see
 * `components/Session/Session.tsx`, currently the only such query.
 *
 * Replaces the `disableSsrByDefault` babel plugin. `ssr` is a React-only option
 * read straight off the hook's second argument, so it cannot be defaulted
 * through `ApolloClient`'s `defaultOptions`.
 */
export const useQuery = ((query: any, options?: any) =>
  useApolloQuery(query, { ssr: false, ...options })) as typeof useApolloQuery;
```

`{ ssr: false, ...options }` is semantically identical to the plugin's
"inject only if absent".

Re-export it from [`src/api/index.ts`](../src/api/index.ts), then add the
guardrail to [`.eslintrc.js`](../.eslintrc.js)'s `restrictedImports`:

```js
{
  path: '@apollo/client',
  importNames: ['useQuery'],
  message: 'Use `useQuery` from `~/api`, which defaults `ssr: false`.',
  replacement: { path: '~/api' },
},
```

This repo already uses auto-fixable `replacement` entries for exactly this kind of
redirect (`react-router` → `react-router-dom`, `@mui/material` `styled` →
`@mui/material/styles`), so **`eslint --fix` performs the 36-file codemod for
you** and lint keeps it true for future code.

Then delete `src/server/disableSsrByDefault.ts`, its `.js` twin, and the entry in
[`.babelrc`](../.babelrc).

`Session.tsx` keeps its `ssr: true` and needs no change.

## Fallback if the team objects to a 36-file import diff

Apollo exposes a hook-wrapper mechanism at
`client.queryManager[Symbol.for("apollo.hook.wrappers")]` (real, self-documented,
used by `@apollo/client-react-streaming`). ~6 lines in `createClient` under
`if (ssr)`, zero source churn, and it scopes the behavior to the *server* client,
which is arguably more precise. It is marked `@internal` and reaches through a
private field, so Apollo 4 may well change it — which is why it is the fallback
and not the recommendation.

## Definition of done

- `grep -rn "from '@apollo/client'" src | grep useQuery` returns nothing.
- `disableSsrByDefault.{ts,js}` are gone and `.babelrc` no longer references them.
- `yarn lint:check` passes with the new rule active.
- SSR smoke test: a data-heavy route renders the same markup volume as before
  (i.e. queries are still *not* running during SSR), and the session query still
  resolves server-side.
- `yarn type-check && yarn test && yarn build` green under Razzle.
