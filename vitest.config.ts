import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { appPlugins } from './vite/plugins';

const src = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: appPlugins(),
  resolve: {
    alias: { '~': src },
  },
  test: {
    // jsdom, not happy-dom: the trees under test lean on getComputedStyle,
    // layout and matchMedia via MUI DataGrid/Tabs and reactflow.
    environment: 'jsdom',
    // Needed, not merely convenient: the tests use bare describe/it/expect and
    // react-intersection-observer's test-utils only installs its mocks when it
    // can see a global `vi`.
    globals: true,
    // `vite/` is included too: the toolchain's own units (the `loadableId`
    // Babel plugin) are tested by the same runner.
    include: ['src/**/*.test.{ts,tsx}', 'vite/**/*.test.ts'],
    setupFiles: ['./src/setupTests.ts'],
  },
});
