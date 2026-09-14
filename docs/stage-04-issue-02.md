---
title: 'Delete Razzle and webpack'
stage: 4
issue: 2
status: open
type: chore
depends_on: [stage-04-issue-01, stage-01-issue-05, stage-01-issue-07]
---

# Delete Razzle and webpack

## Context

Nothing references Razzle any more once `stage-04-issue-01` moves Docker and CI
onto `yarn build`. This is the payoff commit.

It cannot land earlier: `razzle` in [`package.json`](../package.json) is
load-bearing for `loadEnv.codegen.js` → `gql-gen` → `build` until
`stage-01-issue-05` lands, and for `yarn test` until `stage-01-issue-07` lands.

## Task

### Remove from `devDependencies`

```
razzle                          razzle-dev-utils            babel-preset-razzle
webpack                         webpack-dev-server          webpack-bundle-analyzer
webpack-dynamic-public-path     @types/webpack              @types/webpack-env
html-webpack-plugin             mini-css-extract-plugin     babel-loader
tsconfig-paths-webpack-plugin   circular-dependency-plugin  http-proxy-middleware
babel-plugin-transform-imports  babel-plugin-transform-rename-import
@babel/plugin-transform-runtime @babel/plugin-transform-numeric-separator
```

`babel-plugin-transform-rename-import` can only go once `stage-05-issue-01` lands,
or the `graphqlTs()` plugin covers it — confirm which before removing.

### Keep

- `@babel/core`, `@babel/types`, `@babel/helper-plugin-utils`,
  `@types/babel__core` — needed by `@emotion/babel-plugin` and `loadableId`.
- `@babel/runtime` as a **dependency**. [`.yarnrc.yml`](../.yarnrc.yml) declares
  `ahooks` peer-depends on it, and ahooks ships `require('@babel/runtime/helpers/...')`
  calls. Dropping `@babel/plugin-transform-runtime` does not make the runtime
  itself unnecessary.
- `react-pdf`'s `webpack: optional` `packageExtension`. Removing webpack from
  devDeps makes this **more** necessary, not less.

### Dead `resolutions`

`razzle/react-refresh`, `razzle/@pmmmwh/react-refresh-webpack-plugin`, all five
`react-dev-utils/*`, `watchpack-chokidar2/chokidar`,
`css-minimizer-webpack-plugin@npm:^1.2.0`.

**Check before deleting** the five security pins — `cipher-base`, `elliptic`,
`form-data`, `pbkdf2`, `sha.js`. If their only path into the tree was webpack 4's
crypto polyfills they are now dead entries, but `yarn why` each one rather than
assuming. Keep `change-case-all`, `@iarna/rtf-to-html/rtf-parser`,
`@mui/x-data-grid@npm:7.8.0`, `tslib`.

### Dead `packageExtensions`

`razzle@*`, `razzle-dev-utils@*`, `css-minimizer-webpack-plugin@*`.
(`@loadable/babel-plugin@*` went with `stage-02-issue-04`.)

### Yarn patches to delete

- `.yarn/patches/razzle-npm-4.2.18-e0a2c6fe0c.patch`
- `.yarn/patches/css-minimizer-webpack-plugin-npm-1.3.0-c66c75884d.patch`

Keep the six app-level patches: `@mui-x-data-grid`, `final-form`,
`final-form-calculate`, `react-final-form`, `msg-reader`, `rtf-parser`.

### Files

| File | Change |
| --- | --- |
| [`razzle.config.js`](../razzle.config.js) | delete |
| [`.babelrc`](../.babelrc) | delete — Babel plugins now live inline in `vite.config.ts` via `plugin-react`, and Vitest shares them through `vite/plugins.ts` |
| [`.gitignore`](../.gitignore) | drop `/cache` (no Terser cache any more) |
| [`package.json`](../package.json) `clean` | drop `cache`, add `node_modules/.vite` |
| [`AGENTS.md`](../AGENTS.md) | names Razzle in the stack summary (lines ~5, 15, 20), `razzle.config.js` at line ~48, and the command blocks |

Finish with `yarn dedupe` — CI runs `yarn dedupe --check`.

## Definition of done

- `grep -rn "razzle\|webpack" --include='*.json' --include='*.js' --include='*.ts' --include='*.yml' . | grep -v yarn.lock | grep -v node_modules`
  returns only the deliberate `react-pdf` packageExtension.
- `rm -rf node_modules && yarn install --immutable && yarn dedupe --check` clean.
- `yarn gql-gen -e && yarn type-check && yarn lint:check && yarn test && yarn build`
  all green.
- `docker build` + `docker run` serves.
- Full CI green.
