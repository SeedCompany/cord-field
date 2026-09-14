---
title: 'Move call sites off @loadable/component'
stage: 2
issue: 3
status: open
type: refactor
depends_on: [stage-02-issue-01, stage-02-issue-02]
---

# Move call sites off `@loadable/component`

## Context

With the `Loadable` module and its Babel plugin in place, the ~30 call sites move
over. Because the wrapper deliberately mirrors `@loadable`'s API
(`resolveComponent`, `fallback`, `ssr`, `.lib`, `.preload()`), almost every file
is a one-line import change.

## Task

Six files:

| File | Calls | Change |
| --- | --- | --- |
| [`src/scenes/Root/Root.tsx`](../src/scenes/Root/Root.tsx) | 15 | import line only |
| [`src/scenes/Projects/Projects.tsx`](../src/scenes/Projects/Projects.tsx) | 9 | import line + drop two dead magic comments |
| [`src/scenes/Engagement/Engagements.tsx`](../src/scenes/Engagement/Engagements.tsx) | 3 | import line only |
| [`src/components/files/FilePreview/Previewers/index.ts`](../src/components/files/FilePreview/Previewers/index.ts) | 7 | import line only — `stage-01-issue-06` already gave these `resolveComponent` |
| [`src/components/RichText/RichTextField.tsx`](../src/components/RichText/RichTextField.tsx) | 2 | import line only — `.lib`, `ssr: false` and `.preload()` all carry over |
| [`src/client.tsx`](../src/client.tsx) | — | import line only — `setup.push(loadableReady())` stays verbatim |

The import change everywhere:

```diff
-import loadable from '@loadable/component';
+import { loadable } from '~/components/Loadable';
```

In `Projects.tsx`, also drop the two webpack magic comments, which mean nothing to
Rollup (it names dynamic chunks after the module anyway):

```diff
-const ProjectList = loadable(
-  () => import(/* webpackChunkName: "Project-List" */ './List'),
-  { resolveComponent: (m) => m.ProjectList }
-);
+const ProjectList = loadable(() => import('./List'), {
+  resolveComponent: (m) => m.ProjectList,
+});
```

## Note on ordering

This is the first commit where **both toolchains cannot work at once**. The ids
injected by `loadableId` mean nothing to webpack, and `ChunkExtractor` requires
`@loadable/babel-plugin`-transformed call sites. There is no intermediate state
where both render correctly, which is why Stages 1 and 2 front-loaded everything
that *could* land under Razzle.

Expect SSR to be degraded between this issue and `stage-02-issue-04` — the app
renders, but asset tags are still coming from the old extractor. Land the two
together or keep the window short.

## Definition of done

- `grep -rn "@loadable" src` returns nothing.
- Every route behind a converted call site loads: Projects, Project Overview,
  Engagements, Partners, Languages, Users, Locations, Field Regions, Field Zones,
  Search Results, Tools, Dashboard, Progress Reports, Products.
- The rich-text editor still loads EditorJS and its tools.
- **Manual previewer check**: `.csv`, `.docx`, `.xlsx`, `.rtf`, `.msg`, `.pdf`.
- No fallback flash on a hard server-rendered load of a lazy route.
