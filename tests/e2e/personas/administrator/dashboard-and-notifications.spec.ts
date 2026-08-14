import { Page } from '@playwright/test';
import { expect, test } from '../../support/test';

const API_BASE = process.env.RAZZLE_API_BASE_URL ?? 'http://localhost:3000';

const waitForOperation = (page: Page, name: string) =>
  page.waitForResponse(async (res) => {
    if (!res.url().includes(`/graphql/${name}`)) return false;
    const body = await res.json().catch(() => null);
    return !(
      body?.errors?.length === 1 &&
      body.errors[0]?.message === 'PersistedQueryNotFound'
    );
  });

const gql = (page: Page, query: string) =>
  page.request
    .post(`${API_BASE}/graphql`, { data: { query } })
    .then((res) => res.json());

/**
 * Round 9: the Dashboard's `EngagementUsingAIList`, (dashboard-variant)
 * `ProgressReports`, and `PnpProblems` widgets, all deferred out of Round 8
 * as "not gotten to." All three fire on a plain `/dashboard` visit —
 * `Dashboard.tsx`'s `MainDashboard` mounts `EngagementsUsingAIWidget`,
 * `ProgressReportsWidget`, and `PnpProblemsWidget` together unconditionally,
 * no setup required. (`PnpProblems` turned out to be this dashboard widget's
 * own query — `src/scenes/Dashboard/PnpProblemsWidget/pnpProblemsDataGridRow.graphql`
 * — not a per-report query as an earlier research pass assumed.)
 */
test.describe('dashboard widgets (administrator)', () => {
  test('EngagementUsingAIList, ProgressReports, and PnpProblems fire when loading the Dashboard', async ({
    page,
  }) => {
    const [
      engagementsAiResponse,
      progressReportsResponse,
      pnpProblemsResponse,
    ] = await Promise.all([
      waitForOperation(page, 'EngagementUsingAIList'),
      waitForOperation(page, 'ProgressReports'),
      waitForOperation(page, 'PnpProblems'),
      page.goto('/dashboard'),
    ]);
    expect(
      (await engagementsAiResponse.json())?.errors,
      'expected EngagementUsingAIList to load without error'
    ).toBeFalsy();
    expect(
      (await progressReportsResponse.json())?.errors,
      'expected the dashboard ProgressReports widget to load without error'
    ).toBeFalsy();
    expect(
      (await pnpProblemsResponse.json())?.errors,
      'expected the PnpProblems widget to load without error'
    ).toBeFalsy();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});

/**
 * `ReadNotification` — gated behind a `notifications` PostHog feature flag
 * (`useFeatureEnabled('notifications')`), bypassed locally by starting the
 * dev server with `RAZZLE_POSTHOG_FLAG_notifications=true` (confirmed via
 * `Feature.tsx`: an env var whitelist works with no real PostHog project
 * needed). Getting the ADMINISTRATOR persona a real notification to read
 * needed its own investigation — `@-mention` comment notifications are
 * stubbed out server-side (`comment-via-mention-notification.service.ts`'s
 * `extract()` always returns `[]`), but `createSystemNotification` has no
 * self-exclusion filter (confirmed via `system-notification.strategy.ts`:
 * every non-deleted user is a recipient, unlike the project-workflow
 * notification handler, which explicitly excludes the acting user). Calling
 * it as administrator gives the administrator a real `Notification` row.
 */
test.describe('notifications (administrator)', () => {
  test('ReadNotification via the bell icon on a real system notification', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const createResp = await gql(
      page,
      `mutation { createSystemNotification(message: "Playwright test notification ${suffix}") { __typename } }`
    );
    expect(
      createResp?.errors,
      `expected createSystemNotification to succeed: ${JSON.stringify(
        createResp
      )}`
    ).toBeFalsy();

    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'notifications' }).click();
    await expect(
      page.getByText('Notifications', { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(`Playwright test notification ${suffix}`)
    ).toBeVisible();

    // System notifications broadcast to every user with no per-run
    // isolation (no delete mutation exists) — prior runs' own unread
    // notifications accumulate here too. This round's is always the most
    // recent (first, given reverse-chronological order).
    const [readResponse] = await Promise.all([
      waitForOperation(page, 'ReadNotification'),
      page.getByLabel('Mark as read').first().click(),
    ]);
    expect(
      (await readResponse.json())?.errors,
      'expected ReadNotification to succeed'
    ).toBeFalsy();
  });
});
