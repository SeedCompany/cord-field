---
title: 'Replace client `process.env` reads with an `env` accessor'
stage: 1
issue: 8
status: done
type: chore
depends_on: [stage-00-issue-01]
blocks: [stage-03-issue-01]
---

# Replace client `process.env` reads with an `env` accessor

## Context

This issue exists because `stage-00-issue-01` **failed**. The plan had assumed
Vite's `define: { 'process.env': 'window.env' }` would rewrite the prefix of a
member chain, the way webpack's `DefinePlugin` does in
[`razzle.config.js`](../razzle.config.js). Measured on Vite 7.3.6:

- `vite build` rewrites the chain correctly (`window.env.PUBLIC_URL`,
  `window.env[...]`).
- `vite dev` **does not**. Only exact dotted keys are substituted there, so
  `process.env.PUBLIC_URL` reaches the browser verbatim and throws
  `ReferenceError: process is not defined`.

A substitution that works in one mode and not the other is not a foundation to
build Stage 3 on. Replace the implicit bundler rewrite with an explicit
accessor module.

**This belongs in Stage 1, not Stage 3**, because the accessor works identically
under Razzle and Vite: webpack will happily rewrite the single
`process.env` reference inside `env.ts` exactly as it rewrites the 13 reads
today, so this can land, be reviewed, and be deployed while Razzle is still the
only build. It also has real independent value — it makes the client/server env
split explicit in source rather than implicit in bundler config.

## Task

### The accessor

New module, `src/common/env.ts`:

```ts
export const env =
  typeof window !== 'undefined' && window.env ? window.env : process.env;
```

- Export it from `src/common/index.ts` alongside the rest of `~/common`.
- The `typeof window` guard is what makes it isomorphic: on the server it reads
  the real `process.env`, in the browser it reads the per-request object
  [`renderServerSideApp.tsx:171`](../src/server/renderServerSideApp.tsx#L171)
  serializes as `clientEnv` and
  [`indexHtml.ts`](../src/server/indexHtml.ts) emits as `window.env`.
- **A `Window` type augmentation is needed.** Nothing in the repo declares
  `window.env` today — it never had to, because under Razzle no source file ever
  named it. Add it to [`typings/declarations.d.ts`](../typings/declarations.d.ts):

  ```ts
  declare global {
    interface Window {
      env?: NodeJS.ProcessEnv;
    }
  }
  ```

  `NodeJS.ProcessEnv` keeps the accessor's type identical to `process.env`, so
  every call site's inferred `string | undefined` is unchanged and the codemod
  causes **zero** type churn.

### The codemod

Mechanical: `process.env` → `env`, plus an `import { env } from '~/common';`
(merged into the existing `~/common` import where there is one). 13 reads across
8 files:

| File | Reads |
| --- | --- |
| [`src/App.tsx`](../src/App.tsx#L15) | `RAZZLE_LOG_ROCKET_APP_ID` |
| [`src/client.tsx`](../src/client.tsx#L64) | `RAZZLE_POSTHOG_HOST`, `RAZZLE_POSTHOG_KEY`, `PUBLIC_URL` |
| [`src/components/Feature.tsx`](../src/components/Feature.tsx#L16) | `[\`RAZZLE_POSTHOG_FLAG_${flag}\`]`, `RAZZLE_POSTHOG_ALL_FLAGS` — **twice each**, lines 16-17 and 56-57 |
| [`src/components/Session/Session.tsx`](../src/components/Session/Session.tsx#L91) | `RAZZLE_LOG_ROCKET_APP_ID` |
| [`src/scenes/Root/useNonProdWarning.tsx`](../src/scenes/Root/useNonProdWarning.tsx#L10) | `RAZZLE_NON_PROD_WARNING` |
| [`src/scenes/Root/AppMetadata.tsx`](../src/scenes/Root/AppMetadata.tsx#L13) | `RAZZLE_OPEN_SEARCH` |
| [`src/api/client/createClient.ts`](../src/api/client/createClient.ts#L32) | `RAZZLE_GIT_HASH` |
| [`src/api/client/links/http.link.ts`](../src/api/client/links/http.link.ts#L6) | `RAZZLE_API_BASE_URL` |

The two `Feature.tsx` computed reads are the whole reason a bare exact-key
`define` list could never have covered this — they become `env[...]`, which the
accessor handles for free.

`~/common` imports into `src/api/client/*` are fine — the existing code already
crosses that way.

### What to leave alone

Do **not** codemod these. Getting this wrong is the one way to make the change
non-atomic:

- **`NODE_ENV` comparisons** — ~8 sites (`client.tsx:34`, `theme/overrides.ts:33`,
  `theme/emotion.ts:6`, `api/client/createCache.ts:24`,
  `api/client/links/delay.link.ts:8`, `api/client/links/renderErrors.link.tsx:21`,
  `components/RichText/RichTextField.tsx:126`). These are build-time constants,
  not runtime config. Both Razzle and Vite inline them as string literals, which
  is what lets dead branches be tree-shaken out of the production bundle.
  Routing them through `env` would defeat that and *grow* the bundle.
- **`process.env.MUI_X_LICENSE_KEY`** (`App.tsx:42`) — build-time secret, an
  exact `define` key in both toolchains.
- **`process.env.CI`** (`api/schema/client-schema.graphql-loader.ts:23`) —
  codegen-time, never a browser read.
- **Everything under `src/server/`** and `src/index.ts` — these are Node, and
  must keep reading the real `process.env`.
- **`src/serviceWorker.ts`** — `stage-01-issue-01` deletes the file. Order this
  issue after it and the three reads there vanish rather than needing a codemod.

### Guard it

Add a restricted-syntax lint rule so the pattern doesn't regress — the repo
already does exactly this kind of thing in [`.eslintrc.js`](../.eslintrc.js).
Ban `process.env` member access in the client graph, allowlisting `NODE_ENV`,
`MUI_X_LICENSE_KEY`, `src/server/**`, `src/index.ts`, `*.codegen.js` and
`src/common/env.ts` itself. Without this, the next `process.env.RAZZLE_*` read
someone adds will work under Razzle, pass CI, and break only in Vite dev.

## Definition of done

- `src/common/env.ts` exists and is exported from `~/common`.
- `window.env` is declared in `typings/declarations.d.ts`.
- All 13 runtime-env reads listed above go through `env`; the build-time reads
  listed under "What to leave alone" are untouched.
- The lint rule is in place and `yarn lint:check` is green.
- `yarn gql-gen -e && yarn type-check && yarn lint:check && yarn test &&
  yarn build` green **under Razzle** — this commit must not depend on Vite.
- `yarn start` on that build: `window.env` still populated, the PostHog flag
  overrides still work, and the app still talks to the host from
  `RAZZLE_API_BASE_URL`.
- Runtime-env parity survives: build once, run the same artifact with a
  different `RAZZLE_API_BASE_URL` and `PUBLIC_URL`, and confirm both still take
  effect without a rebuild. This is the property the whole accessor exists to
  protect.
