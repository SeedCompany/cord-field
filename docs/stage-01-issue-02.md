---
title: 'Delete orphaned Storybook stories'
stage: 1
issue: 2
status: open
type: cleanup
---

# Delete orphaned Storybook stories

## Context

There are **75 `.stories.tsx` files** in `src/`, but:

- there is no `.storybook/` directory anywhere in the repo,
- there is no `storybook` script in [`package.json`](../package.json),
- [`tsconfig.json`](../tsconfig.json) explicitly excludes `**/*.stories.tsx`, so
  they are not even type-checked,
- [`.eslintignore`](../.eslintignore) ignores them, so they are not linted either.

They are unbuilt, unchecked, unlinted dead weight that will confuse every future
grep and every codemod in this migration — including the `.graphql` codemod in
Stage 5, which would otherwise have to decide whether to rewrite imports inside
files nothing compiles.

There is also a stale JetBrains run configuration,
`.idea/runConfigurations/start_storybook.xml`, pointing at a script that no longer
exists.

## Task

- Delete all 75 `**/*.stories.tsx` files under `src/`.
- Delete `.idea/runConfigurations/start_storybook.xml`.
- Drop the now-pointless `**/*.stories.tsx` entries from
  [`tsconfig.json`](../tsconfig.json)'s `exclude` and [`.eslintignore`](../.eslintignore).

Keep this as its own commit so it is trivially reviewable and trivially revertable
if someone wants Storybook back.

## Definition of done

- `find src -name '*.stories.tsx'` returns nothing.
- `yarn type-check && yarn lint:check && yarn test && yarn build` still green
  under Razzle.
