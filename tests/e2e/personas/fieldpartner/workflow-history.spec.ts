import { expect, test } from '../../support/test';

const API_BASE = process.env.RAZZLE_API_BASE_URL ?? 'http://localhost:3000';

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
 *
 * A second version of this test picked "whichever report the UI lists
 * first" — which quietly broke this test's own mutation coverage the
 * *second* time it ever ran: that first report had already been
 * transitioned out of `NotStarted` by the previous run (this is a
 * persistent local dev database, not reset per test run), so "click the
 * one available transition button" ended up clicking some other button
 * entirely, and `TransitionProgressReport` silently never fired — the
 * pass/fail result stayed correct (FieldPartner still couldn't see an
 * event that already existed from before) but the "confirm the mutation
 * actually fires" guarantee this test's docstring claims was quietly lost.
 * Fixed by looking up a real, still-`NotStarted` report via the API first
 * — confirmed live there are always several (11 of 12 seeded reports were
 * still `NotStarted` after the first run had transitioned just one) — so
 * this stays deterministic run after run without needing a database reset.
 * A naive unscoped `progressReports` query isn't enough on its own, though:
 * FieldPartner can *read* reports belonging to projects they're not a
 * member of (a broader read policy than their execute rights), and a
 * `NotStarted` report from one of those renders `TransitionButtons` with
 * zero real transitions (`canBypassTransitions` is false and `transitions`
 * is empty for them there) — confirmed live: the "first button" ends up
 * being some unrelated control elsewhere on the page. Scoping the lookup to
 * FieldPartner's own (`isMember: true`) project's own engagement first
 * avoids that.
 */
test.describe('fieldpartner workflow history', () => {
  test('cannot see even the transition they just executed themselves', async ({
    page,
  }) => {
    const myProjectResponse = await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query:
          'query { projects(input:{filter:{isMember:true},count:1}) { items { engagements { items { id } } } } }',
      },
    });
    const engagementId = (await myProjectResponse.json())?.data?.projects
      ?.items?.[0]?.engagements?.items?.[0]?.id;
    expect(
      engagementId,
      'expected fieldpartner to be a member of at least one project with an engagement'
    ).toBeTruthy();

    // `LanguageEngagement.progressReports` takes `PeriodicReportListInput`,
    // not `ProgressReportListInput` — no `filter` field at all here
    // (confirmed live: the server rejects it as an unknown field). Filtered
    // client-side instead.
    const reportsResponse = await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query: `query($id: ID!) { engagement(id: $id) { ... on LanguageEngagement { progressReports(input:{count:20}) { items { id status { value } } } } } }`,
        variables: { id: engagementId },
      },
    });
    const reports = (await reportsResponse.json())?.data?.engagement
      ?.progressReports?.items;
    const reportId = reports?.find(
      (r: { status: { value: string } }) => r.status.value === 'NotStarted'
    )?.id;
    expect(
      reportId,
      "expected at least one NotStarted progress report on fieldpartner's own engagement"
    ).toBeTruthy();

    await page.goto(`/progress-reports/${reportId}/edit`);
    await page.waitForURL(/\/progress-reports\/[^/]+\/edit/u);
    // A `NotStarted` report renders `StartReportPage`, not the full report
    // stepper — but the drawer opens instantly on navigation while its
    // GraphQL data is still loading, and the underlying (skeleton-filled)
    // detail page behind it has its own numbered step buttons in the
    // meantime. Without this wait, the "first button with text" ends up
    // being one of those loading-skeleton step badges instead of the real
    // transition button, and never fires the mutation at all.
    await expect(
      page.getByText('This report has not yet been started')
    ).toBeVisible();

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
