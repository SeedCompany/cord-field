import { defineConfig, devices } from '@playwright/test';
import { authFileFor, PERSONAS } from './tests/e2e/support/personas';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const isCi = Boolean(process.env.CI);
const isLocalUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?/u.test(
  baseURL
);
const shouldStartWebServer =
  isLocalUrl && process.env.PLAYWRIGHT_SKIP_WEB_SERVER !== 'true';

// MUI's `md` breakpoint (900px) is where the app switches to its mobile
// layout (see src/common/useIsMobile.ts) — persona projects render below it
// so tests hit the simpler mobile list/nav markup instead of the desktop
// data grid, which is far more Playwright-friendly to query against.
const mobileViewport = { width: 500, height: 900 };

// eslint-disable-next-line import/no-default-export -- required by Playwright's config loader
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    browserName: 'chromium',
    // Use the system-installed Chrome rather than Playwright's own bundled
    // Chromium download — on Apple Silicon, a freshly downloaded/extracted
    // bundled build needs a post-install ad-hoc codesign step that can fail
    // silently, and the OS hard-kills any unsigned arm64 binary on launch.
    // A real installed browser is already properly signed.
    channel: 'chrome',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    // 'off' rather than 'retain-on-failure': recording needs Playwright's
    // bundled ffmpeg, which isn't installed here (we're using system Chrome
    // via `channel` above specifically to avoid Playwright's own browser
    // downloads). Revisit once/if that's installed separately.
    video: 'off',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/u,
    },
    // Unauthenticated smoke tests (e.g. tests/e2e/smoke/projects.spec.ts) —
    // no storageState, no dependency on the setup project.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [/personas\//u],
    },
    ...PERSONAS.map((persona) => ({
      name: persona,
      use: {
        ...devices['Desktop Chrome'],
        viewport: mobileViewport,
        storageState: authFileFor(persona),
      },
      testDir: `./tests/e2e/personas/${persona}`,
      dependencies: ['setup'],
    })),
  ],
  webServer: shouldStartWebServer
    ? {
        command: process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? 'yarn start',
        url: baseURL,
        reuseExistingServer: !isCi,
        timeout: 120_000,
      }
    : undefined,
});
