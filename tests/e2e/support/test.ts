import { test as base, expect } from '@playwright/test';
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * Every named GraphQL operation cord-field issues hits
 * `{server}/graphql/{operationName}` via a plain (unbatched) HttpLink — one
 * operation per HTTP request, name in the URL path. That makes network-level
 * interception a reliable way to answer "which of the app's known operations
 * did this run actually exercise, and did any of them error" — see
 * coverage-report.ts for how these rows get turned into a report.
 */
interface CoverageRow {
  operation: string;
  ok: boolean;
  hasErrors: boolean;
  errorMessages?: string[];
  persona: string;
  spec: string;
}

const TAG = process.env.PLAYWRIGHT_COVERAGE_TAG ?? 'default';

const coverageFilePath = (workerIndex: number) =>
  `tests/e2e/.coverage/${TAG}/${workerIndex}.jsonl`;

const GRAPHQL_OPERATION_URL = /\/graphql\/([^/?]+)/u;

export interface Cleanup {
  /**
   * Register teardown for something this test created. Runs after the test in
   * reverse order of registration, and — unlike a trailing `await delete...()`
   * at the end of the test body — runs even when the test fails partway.
   */
  add: (label: string, fn: () => Promise<unknown>) => void;
}

export const test = base.extend<{
  trackGraphqlCoverage: void;
  cleanup: Cleanup;
}>({
  /**
   * Teardown that survives failure.
   *
   * Every spec used to clean up with trailing statements in the test body, so
   * any earlier failing assertion skipped them — which is how throwaway
   * partners, projects, locations and languages piled up in the dev database
   * and then broke the specs that depend on list ordering or look fixtures up
   * by name. Playwright runs fixture teardown regardless of test outcome.
   */
  // eslint-disable-next-line no-empty-pattern
  cleanup: async ({}, use) => {
    const tasks: Array<{ label: string; fn: () => Promise<unknown> }> = [];
    await use({ add: (label, fn) => tasks.push({ label, fn }) });
    // Reverse order: later-created things may reference earlier ones. One
    // failure must not skip the rest, so each is caught individually.
    for (const task of tasks.reverse()) {
      try {
        await task.fn();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`[cleanup] "${task.label}" failed: ${String(e)}`);
      }
    }
  },
  trackGraphqlCoverage: [
    // eslint-disable-next-line no-empty-pattern
    async ({ page }, use, testInfo) => {
      const rows: CoverageRow[] = [];
      // response.json() resolves asynchronously — track each in-flight parse
      // so we can await them all before the test ends. Without this, the
      // last response or two of a test can resolve after we've already
      // checked rows.length, silently dropping them from the coverage file.
      const pending: Array<Promise<void>> = [];

      const onResponse = (response: import('@playwright/test').Response) => {
        const match = GRAPHQL_OPERATION_URL.exec(response.url());
        if (!match) return;
        const operation = match[1]!;
        const base = {
          operation,
          ok: response.ok(),
          persona: testInfo.project.name,
          spec: testInfo.titlePath.join(' > '),
        };

        // @live queries/subscriptions ride a long-lived `text/event-stream`
        // response over this same graphql/{operationName} URL shape (see
        // sse.link.ts) — its body never "completes" while the connection
        // is open, so response.json() on it hangs for the life of the
        // page, not just the request. Record it as exercised without
        // waiting on a body we can't (and shouldn't) fully read here.
        const contentType = response.headers()['content-type'] ?? '';
        if (!contentType.includes('application/json')) {
          rows.push({ ...base, hasErrors: false });
          return;
        }

        pending.push(
          response
            .json()
            .catch(() => null)
            .then((body: { errors?: Array<{ message?: string }> } | null) => {
              // Automatic persisted queries retry transparently on a
              // cache miss (a fresh/just-restarted server hasn't seen
              // the hash yet) — Apollo resends with the full query and
              // it succeeds right after. Confirmed in practice: a
              // server restart produced this on nearly every operation
              // in one run and broke nothing visible. Real errors, not
              // this one expected transient shape, are what matter.
              const errors = (body?.errors ?? []).filter(
                (e) => e.message !== 'PersistedQueryNotFound'
              );
              rows.push({
                ...base,
                hasErrors: errors.length > 0,
                errorMessages: errors.length
                  ? errors.map((e) => String(e.message ?? e))
                  : undefined,
              });
            })
        );
      };
      page.on('response', onResponse);

      await use();

      // A request the page's own JS has already fully consumed (enough to
      // have updated the DOM and satisfied a test assertion) can still be
      // slightly ahead of Playwright's CDP-level 'response' event for that
      // same request — observed directly: a query whose response updates
      // page title, asserted on via toHaveTitle, still had its request
      // fire with no matching 'response' event ever captured before this
      // point. A short grace period closes that race; network-idle isn't
      // an option here since @live/SSE connections never go idle.
      await page.waitForTimeout(250);
      page.off('response', onResponse);
      await Promise.all(pending);
      if (rows.length > 0) {
        const filePath = coverageFilePath(testInfo.workerIndex);
        mkdirSync(dirname(filePath), { recursive: true });
        appendFileSync(
          filePath,
          rows.map((row) => JSON.stringify(row)).join('\n') + '\n'
        );
      }
    },
    { auto: true },
  ],
});

export { expect };
