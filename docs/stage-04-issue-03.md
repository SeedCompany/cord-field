---
title: 'Restore the bundle analyzer'
stage: 4
issue: 3
status: open
type: chore
depends_on: [stage-04-issue-02]
---

# Restore the bundle analyzer

## Context

`yarn analyze` currently runs `yarn build --analyze`, which
[`razzle.config.js`](../razzle.config.js) detects via
`process.argv.includes('--analyze')` and turns into a `BundleAnalyzerPlugin`.

Vite's CLI will not forward an unknown `--analyze` flag, so the trigger has to
change along with the plugin.

## Task

Add `rollup-plugin-visualizer` (dev) and switch the trigger to an env var:

```json
"analyze": "ANALYZE=1 yarn build:client"
```

```ts
...(isClient && process.env.ANALYZE
  ? [visualizer({
      filename: 'build/report.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    })]
  : []),
```

Client-only — a treemap of the server bundle isn't useful.

## Why this is worth doing rather than dropping

The migration changes what gets bundled in several ways that are hard to eyeball:
dropping `babel-plugin-transform-imports`, the `lodash` → `lodash-es` alias, node
polyfills, and Rollup's chunking replacing webpack's. Having the analyzer back
makes the "did the bundle regress?" checks in the other issues answerable rather
than guesswork.

## Definition of done

- `yarn analyze` writes `build/report.html`.
- The report confirms the two things the migration could plausibly have broken:
  `lodash` appears tree-shaken (not the full library), and the node polyfills
  appear only in lazy previewer chunks, not the entry.
- Update the `analyze` line in [`AGENTS.md`](../AGENTS.md) if it documents the old
  flag.
