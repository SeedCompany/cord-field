import { expect, test } from '../../support/test';

/**
 * PRW-1 (cord-api-v3's pre-cutover-audit-ledger.md): `ProgressReportWorkflowEvent`
 * read-authorization is enforced on Neo4j but entirely absent from the
 * Drizzle (Postgres) repository — any role with zero grant on this resource
 * gets the FULL status history anyway. FieldPartner is the right persona to
 * catch this: its policy (field-partner.policy.ts) grants
 * `ProgressReportWorkflowEvent.transitions('Start', ...).execute` but has NO
 * `.read` grant at all on the resource — so even a transition FieldPartner
 * just executed themselves should stay invisible to them in history.
 *
 * The first version of this test picked an arbitrary report and found one
 * that had genuinely never transitioned — `WorkflowCard` correctly hides
 * "View History" with zero events for everyone in that case, not a
 * permission signal. Fixed by having FieldPartner execute the one
 * transition their own policy allows ('Start', from NotStarted), then
 * checking they can't see the very event they just caused.
 */
test.describe('fieldpartner workflow history', () => {
  test('cannot see even the transition they just executed themselves', async ({
    page,
  }) => {
    await page.goto('/projects');

    const main = page.getByRole('main');
    await main.getByRole('link').first().click();
    await page.waitForURL(/\/projects\/[^/]+$/u);

    await page.getByRole('link', { name: 'View Details' }).first().click();
    await page.waitForURL(/\/engagements\/[^/]+$/u);

    await page.getByRole('link', { name: 'All Reports' }).click();
    await page.waitForURL(/\/engagements\/[^/]+\/reports\/progress$/u);

    // The progress reports list is a MUI DataGrid, not the mobile
    // EntityList pattern used elsewhere in this app — its rows are
    // harder to address by role, so a plain href-attribute selector is
    // the more robust choice here.
    const reportRow = page.locator('a[href*="/progress-reports/"]').first();
    await expect(reportRow).toBeVisible();
    await reportRow.click();
    await page.waitForURL(/\/progress-reports\/([^/]+)$/u);

    const reportId = /\/progress-reports\/([^/]+)$/u.exec(page.url())![1]!;

    await page.getByRole('link', { name: 'Edit Report' }).click();
    await page.waitForURL(/\/progress-reports\/[^/]+\/edit/u);

    // Whatever the one available transition from NotStarted is labeled,
    // there's exactly one FieldPartner can execute from here ('Start') —
    // no need to know its exact display text.
    await page.getByRole('button').filter({ hasText: /.+/u }).first().click();

    await page.goto(`/progress-reports/${reportId}/workflow-history`);
    // Positive wait first: the title only gets its " - " separator once
    // the report data (same query that supplies workflowEvents) has
    // actually resolved — without this, the emptiness check below could
    // trivially pass before the query even finishes.
    await expect(page).toHaveTitle(/ - /u);
    await expect(page.getByLabel('transitioned to')).toHaveCount(0);
  });
});
