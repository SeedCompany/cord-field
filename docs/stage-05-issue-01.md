---
title: 'Codemod .graphql imports to .graphql.ts'
stage: 5
issue: 1
status: done
type: refactor
depends_on: [stage-04-issue-02]
---

# Codemod `.graphql` imports to `.graphql.ts`

## Context

826 imports across the repo end in `.graphql` while the files they resolve to are
`.graphql.ts`:

```ts
import { ToolDetailDocument } from './ToolDetail.graphql';
import { CreateOrganization } from '~/api/schema.graphql';
```

Under Razzle this works because `babel-plugin-transform-rename-import` rewrites
`/(.+)\.graphql$/` → `$1.graphql.ts`. The `.graphql` files themselves are codegen
*inputs* and are never loaded by the bundler.

Vite covers it in the meantime with the `graphqlTs()` resolver plugin from
`stage-03-issue-01`. This issue removes the need for either, so the import paths
match the files that actually exist and one piece of build magic goes away
permanently.

**This is deliberately last.** It is a large mechanical diff that would drown
every review it shares a commit with, and it is the one change that is purely
cosmetic if it never lands.

## The tsconfig flag

Bare `import … from './Foo.graphql.ts'` fails with:

> TS5097: An import path can only end with a '.ts' extension when
> 'allowImportingTsExtensions' is enabled.

Add to [`tsconfig.json`](../tsconfig.json):

```json
"allowImportingTsExtensions": true,
```

The flag requires `noEmit` or `emitDeclarationOnly`. This repo already has
`"noEmit": true`, and the combination was verified against this repo's exact
settings (`moduleResolution: node`, `target: esnext`) — it type-checks clean.

## Task

Split into the two populations, because they are fixed differently:

| Population | Count | Fix |
| --- | --- | --- |
| Hand-written imports in `.ts`/`.tsx` | **587** | codemod |
| Imports inside generated `.graphql.ts` files | **239** | change codegen config |

For the generated half, update `baseTypesPath` in
[`codegen.operations.yml`](../codegen.operations.yml) so
`near-operation-file` emits `~~/api/schema.graphql.ts`, and check the two
sibling-fragment imports in `src/api/schema.graphql.ts`.

Then delete:

- the `graphqlTs()` plugin from `vite/plugins.ts` and its file,
- `babel-plugin-transform-rename-import` from [`package.json`](../package.json),
- the `.graphql` `moduleNameMapper`-equivalent from the Vitest config, if any
  survived.

Check whether the `*.graphql.ts` patterns in [`.eslintignore`](../.eslintignore),
[`.prettierignore`](../.prettierignore), [`.gitignore`](../.gitignore) and
`package.json`'s `clean` glob still match — the file names do not change, so they
most likely do.

## Scope discipline

**This commit changes nothing else.** No config tidying, no drive-by fixes. It
should be reviewable by reading the codemod script and spot-checking a handful of
the 587 rewrites.

## Definition of done

- `grep -rn "\.graphql'" src` matches only `.graphql.ts` paths.
- No resolver plugin or Babel rename plugin remains.
- `yarn type-check` clean.
- `yarn clean && yarn gql-gen` regenerates files whose imports already match the
  codemod — i.e. running codegen does not produce a diff.
- `yarn build` and `yarn test` green.
