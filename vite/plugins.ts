import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';
import { graphqlTs } from './plugins/graphqlTs';

/**
 * The plugins the app is compiled with. Shared by `vitest.config.ts` and (from
 * stage 3 on) `vite.config.ts` so the two cannot drift.
 */
export const appPlugins = (): PluginOption[] => [
  graphqlTs(),
  react({
    jsxImportSource: '@emotion/react',
    babel: { plugins: ['@emotion/babel-plugin'] },
  }),
];
