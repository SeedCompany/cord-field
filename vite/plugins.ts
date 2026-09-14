import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import type { PluginOption } from 'vite';
import { loadableId } from './babel/loadableId';
import { graphqlTs } from './plugins/graphqlTs';

/** The repo root, which `loadableId`'s ids are relative to. */
const root = fileURLToPath(new URL('..', import.meta.url));

/**
 * The plugins the app is compiled with. Shared by `vitest.config.ts` and (from
 * stage 3 on) `vite.config.ts` so the two cannot drift.
 */
export const appPlugins = (): PluginOption[] => [
  graphqlTs(),
  react({
    jsxImportSource: '@emotion/react',
    // `loadableId` has to run here, in Babel, rather than as a Rollup
    // transform: it is the one transform that runs identically in the client
    // and the SSR build, which is what makes the injected ids match.
    babel: {
      plugins: ['@emotion/babel-plugin', [loadableId, { root }]],
    },
  }),
];
