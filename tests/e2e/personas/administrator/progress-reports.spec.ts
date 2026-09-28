import { API_BASE } from '../../support/graphql';
import { expect, test } from '../../support/test';

/**
 * RPT-1 (cord-api-v3's pre-cutover-audit-ledger.md): the actual query behind
 * this page — `ProgressReportRepository.list()` — reportedly has no
 * Postgres arm at all as of this session (confirmed directly by reading
 * progress-report.repository.ts on the checked-out branch: it extends the
 * Neo4j `DtoRepository` unconditionally, no splitDb). If true, this page
 * would be silently reading Neo4j regardless of `DATABASE=postgres`.
 *
 * That's NOT something this test can catch — a silent same-shape fallback to
 * the other engine doesn't error or look different on screen; it would look
 * exactly like this test passing for the wrong reason. This stays a smoke
 * check (loads without error) rather than a claim of Postgres coverage.
 * Track RPT-1 as a backend code fact, not a UI assertion.
 */
test.describe('progress reports (administrator)', () => {
  test("a project's reports tab loads without error", async ({ page }) => {
    // Not "click the first project in the list" — with `fullyParallel`
    // workers, other specs' own throwaway projects (including Internship-
    // type ones, which don't show "All Reports" the same way) can
    // transiently sort before this suite's one seeded fixture project.
    // Looking it up by name directly avoids that race.
    const lookupRes = await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query:
          'query { projects(input:{filter:{name:"Playwright Seed Project"},count:1}) { items { id } } }',
      },
    });
    const projectId = (await lookupRes.json())?.data?.projects?.items?.[0]?.id;
    expect(
      projectId,
      'expected the seeded fixture project to exist'
    ).toBeTruthy();

    await page.goto(`/projects/${projectId}`);
    await page.waitForURL(/\/projects\/[^/]+$/u);

    const allReportsLink = page
      .getByRole('link', { name: 'All Reports' })
      .first();
    await expect(allReportsLink).toBeVisible();
    await allReportsLink.click();

    await page.waitForURL(
      /\/projects\/[^/]+\/reports\/(narrative|financial)$/u
    );
    // A positive wait first — matters here specifically. The two
    // `not.toBeVisible()` checks below pass trivially (with no waiting at
    // all) if the page hasn't finished loading yet, which would silently
    // let this test finish before the NarrativeReports/FinancialReports
    // query it's meant to exercise even fires. toHaveTitle forces a real
    // wait for the query to resolve, since the title is set from its data.
    await expect(page).toHaveTitle(/Report/u);
    await expect(
      page.getByText('Error loading progress reports')
    ).not.toBeVisible();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
