---
title: 'Load dotenv without Razzle'
stage: 1
issue: 5
status: done
type: chore
blocks: [stage-04-issue-02]
---

# Load dotenv without Razzle

## Context

[`src/api/schema/codeGenUtil/loadEnv.codegen.js`](../src/api/schema/codeGenUtil/loadEnv.codegen.js)
imports Razzle directly:

```js
require('razzle/config/env').setupEnvironment({
  dotenv: __dirname + '/../../../../.env',
});
process.env.NODE_NO_WARNINGS = '1';
```

This is a **hard ordering constraint** on the whole migration:
`yarn gql-gen` depends on this file, and `yarn build` depends on `gql-gen`. So
Razzle cannot be removed from `package.json` until this is replaced — otherwise
CI dies at the first step.

Razzle's `setupEnvironment` is ~20 lines: load `.env.${NODE_ENV}.local` →
`.env.${NODE_ENV}` → `.env.local` (skipped when `NODE_ENV=test`) → `.env`, each
through `dotenv` + `dotenv-expand`, relying on dotenv's first-write-wins
semantics.

Both `dotenv` (8.6.0) and `dotenv-expand` (5.1.0) are **already direct devDeps**.

## Task

Add a shared CJS module — CJS because the codegen hook is loaded via `ts-node -r`,
and `vite.config.ts` will need it too:

```js
// config/loadDotenv.cjs
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand'); // v5 API: expand(config)

const root = path.resolve(__dirname, '..');
const NODE_ENV = process.env.NODE_ENV || 'development';

// Same order & precedence as razzle/config/env.setupEnvironment.
// dotenv never overwrites an already-set var, so earlier files win.
const files = [
  `.env.${NODE_ENV}.local`,
  `.env.${NODE_ENV}`,
  NODE_ENV !== 'test' && '.env.local',
  '.env',
].filter(Boolean);

for (const file of files) {
  const p = path.join(root, file);
  if (fs.existsSync(p)) dotenvExpand(dotenv.config({ path: p }));
}
```

Then reduce the codegen hook to:

```js
require('../../../../config/loadDotenv.cjs');

// https://github.com/dotansimha/graphql-code-generator/issues/7239
process.env.NODE_NO_WARNINGS = '1';
```

## Notes

- **Do not use Vite's `loadEnv`.** It returns an object and does not mutate
  `process.env`, but [`codegen.operations.yml`](../codegen.operations.yml) uses
  `${RAZZLE_API_BASE_URL}`, which graphql-codegen expands from `process.env`.
- **Do not bump `dotenv`/`dotenv-expand`.** They are pinned; `dotenv-expand@5` is
  the function-call API (`expand(config)`), not `@9`'s `{ expand }`. Bumping them
  is separate risk.
- One deliberate delta from Razzle: it *throws* when `NODE_ENV` is unset, because
  it always set it first. This defaults to `development` instead, so a bare
  `yarn gql-gen` works locally. CI sets `NODE_ENV: development` explicitly.
- `vite.config.ts` will need to `require('./config/loadDotenv.cjs')` at the top in
  Stage 3 — **easy to miss, and the failure is subtle**: in dev,
  `renderServerSideApp` builds `clientEnv` from the Vite dev-server process's
  `process.env`, so without this every GraphQL call in dev silently targets the
  wrong host.

## Definition of done

- `grep -rn "razzle" src/api` returns nothing.
- `rm -f schema.graphql && yarn gql-gen -e && test -s schema.graphql` passes.
- `.env.local` still overrides `.env` — assert the `.env.local` value for
  `RAZZLE_API_BASE_URL` wins.
- `yarn build` green under Razzle.
