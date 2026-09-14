---
title: 'Migrate Jest to Vitest'
stage: 1
issue: 7
status: open
type: test
blocks: [stage-04-issue-02]
---

# Migrate Jest to Vitest

## Context

`"test": "razzle test --env=jsdom"`. There is **no `jest.config.js` and no `jest`
key** in [`package.json`](../package.json) — the entire Jest config is synthesized
by Razzle at runtime and then mutated by `modifyJestConfig` in
[`razzle.config.js`](../razzle.config.js), which adds exactly two things:

```js
config.moduleNameMapper['~/(.+)'] = '<rootDir>/src/$1';
config.snapshotSerializers = ['@emotion/jest/serializer'];
```

**Jest is not even a direct dependency** — it arrives transitively through Razzle.
So deleting Razzle breaks `yarn test` outright. That makes this a prerequisite for
Stage 4, not an optional nicety.

**Landing this early is the highest-leverage ordering decision in the migration.**
It adds `vite`, `vitest`, `@vitejs/plugin-react` and a `vite/` directory, but does
**not** touch the app build — Razzle still builds and serves. Every commit after
this one is then validated by a real test suite rather than by hope.

## Task

Add `vitest.config.ts`, sharing plugins with the future `vite.config.ts` via a
`vite/plugins.ts` module so the two never drift:

```ts
// vite/plugins.ts
import react from '@vitejs/plugin-react';
import { graphqlTs } from './plugins/graphqlTs';

export const appPlugins = () => [
  graphqlTs(),
  react({
    jsxImportSource: '@emotion/react',
    babel: { plugins: ['@emotion/babel-plugin'] },
  }),
];
```

The `graphqlTs()` resolver plugin (`enforce: 'pre'`, mapping `*.graphql` →
`*.graphql.ts`) replaces the `moduleNameMapper` trick and is the same plugin
Stage 3 uses. `resolve.alias` `~` → `src` replaces the other `moduleNameMapper`
entry.

### Decisions, with reasons

- **`environment: 'jsdom'`, not happy-dom.** The trees under test pull in
  `@mui/x-data-grid-pro`, `@mui/lab` `TabContext`, MUI `useMediaQuery` and
  `reactflow`. happy-dom's `getComputedStyle`/layout/`matchMedia` gaps bite
  exactly this stack. 13 files — the speed difference is seconds.
- **`globals: true`.** Three independent reasons, not just convenience: all 13
  files use bare `describe`/`it`/`expect`; `react-intersection-observer@9.5.2`'s
  `test-utils` does `else if (typeof vi !== 'undefined')` and **silently skips
  installing its mocks** without the global; and `jest-express` needs a global.
  Add `typings/vitest.d.ts` with `/// <reference types="vitest/globals" />` rather
  than a tsconfig `types` array, which would suppress `@types/node` and break
  `NodeJS.ProcessEnv`.
- **Upgrade `@testing-library/jest-dom` v5 → v6.** v6 ships a `/vitest` entry that
  registers against Vitest's `expect` *and* provides matcher types via `vitest`
  module augmentation. v5 would work at runtime under `globals: true`, but its
  types augment the `jest` namespace, so every `toBeInTheDocument()` becomes a
  type error. Works with the installed `@testing-library/dom@8` / RTL 13.4 — no
  RTL upgrade needed.
- **Drop `@emotion/jest` entirely.** `find src -name '*.snap'` returns nothing and
  there is no `toMatchSnapshot`/`toHaveStyleRule` anywhere — the serializer Razzle
  configured has never serialized anything.

### Per-file changes

`src/setupTests.ts`:

```diff
-import '@testing-library/jest-dom/extend-expect';
-
 import 'react-intersection-observer/test-utils';
-
-import '@emotion/jest';
+import '@testing-library/jest-dom/vitest';
```

**Mechanical `jest.` → `vi.`** in 8 files: `UpdateProjectDialog`,
`FieldRegionDetail`, `FieldZoneDetail`, `LocationDetail`, `LanguageField`,
`MarketingRegionField`, `TabList`, `PartnerLanguagesSection`.

**One non-mechanical case** —
[`src/components/Tabs/TabList.test.tsx`](../src/components/Tabs/TabList.test.tsx),
where `jest.requireActual` is sync but `vi.importActual` is async:

```diff
-jest.mock('~/common', () => ({
-  ...jest.requireActual('~/common'),
-  useIsMobile: jest.fn(),
-}));
-const mockUseIsMobile = useIsMobile as jest.Mock;
+vi.mock('~/common', async () => ({
+  ...(await vi.importActual<typeof import('~/common')>('~/common')),
+  useIsMobile: vi.fn(),
+}));
+const mockUseIsMobile = vi.mocked(useIsMobile);
```

**`jest-express` in [`src/App.test.tsx`](../src/App.test.tsx)** calls the global
`jest` object internally (`lib/request.js` does `this.accepts = jest.fn()` at
construction), so it breaks under Vitest. The test only needs `req.originalUrl`
and `req.cookies` plus a `res` handed to `createClient({ ssr })`. **Replace with a
~15-line local fake and drop the dep.** A `globalThis.jest = vi` shim in
`setupTests.ts` works as a one-line escape hatch but is a smell in a vitest repo.

No other Jest APIs are in use — no `jest.spyOn`, no fake timers, no snapshots
(verified by grep across `src`).

### Deps

- **Add (dev)**: `vitest`, `jsdom`, `vite`, `@vitejs/plugin-react`,
  `@testing-library/jest-dom@^6`.
- **Remove (dev)**: `@types/jest`, `@jest/types`,
  `@types/testing-library__jest-dom`, `@emotion/jest`, `jest-express`.
- **Scripts**: `"test": "vitest run"`, `"test:watch": "vitest"`.
- Delete `modifyJestConfig` from [`razzle.config.js`](../razzle.config.js).

## Definition of done

- All 13 test files pass under `yarn test`.
- `yarn type-check` clean, including the `toBeInTheDocument()` matchers.
- **Razzle still builds and serves** — `yarn build` and `yarn start` unaffected.
- CI's Test step passes.
