import { Page } from '@playwright/test';
import { gql, waitForOperation } from '../../support/graphql';
import { expect, test } from '../../support/test';

const recordYears = async (page: Page, projectId: string) => {
  const resp = await gql(
    page,
    `query { project(id: "${projectId}") { budget { value { records { fiscalYear { value } } } } } }`
  );
  const records: Array<{ fiscalYear: { value: number } }> =
    resp?.data?.project?.budget?.value?.records ?? [];
  return records.map((r) => r.fiscalYear.value).sort((a, b) => a - b);
};

/**
 * Round 11 (depth): derived-data assertions. The Round 9 spec proved
 * `SyncBudgetRecordsToFundingPartners` generates *a* BudgetRecord; this
 * asserts the actual math and the full add/remove lifecycle, because an
 * operation succeeding against Postgres is not the same as it deriving the
 * right rows.
 *
 * Ground truth (cord-api-v3, verified in source):
 * - `fiscal-year.ts`: `fiscalYear(dt) = dt.year + (dt.month >= 10 ? 1 : 0)`
 *   (October-start FY) and `fiscalYears(start, end)` is the inclusive range.
 *   The mou range here (2025-09-15 → 2025-10-15) is one month long but
 *   deliberately straddles Oct 1, so it must yield exactly FY2025 + FY2026 —
 *   an off-by-one in either backend's fiscal math fails this immediately.
 * - `sync-budget-records-to-funding-partners.handler.ts`: on
 *   `ProjectUpdatedHook` it diffs previous vs expected years per funding
 *   partnership (`difference` both directions), so extending the mou range
 *   must ADD records and shrinking it must REMOVE them — both directions
 *   asserted below.
 * - Partner/partnership setup rules (Funding gates the sync; Managing +
 *   financialReportingTypes required for the create calls to pass) are
 *   Round 9 findings — see product-progress-and-budget.spec.ts.
 *
 * Written in Round 11 while the local API was pointed at the cutover DB
 * (personas unseeded) — verified against both repos' source; first live run
 * still pending.
 */
test.describe('budget record derivation (administrator)', () => {
  test('records track the fiscal years of the mou range through extend and shrink, and the total sums in the UI', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const orgName = `Playwright FiscalMath Org ${suffix}`;

    const orgResp = await gql(
      page,
      `mutation { createOrganization(input:{name:"${orgName}"}) { organization { id } } }`
    );
    const orgId = orgResp?.data?.createOrganization?.organization?.id;
    expect(orgId, 'failed to create the throwaway organization').toBeTruthy();

    const partnerResp = await gql(
      page,
      `mutation { createPartner(input:{organization:"${orgId}", types:[Funding, Managing], financialReportingTypes:[Funded]}) { partner { id } } }`
    );
    const partnerId = partnerResp?.data?.createPartner?.partner?.id;
    expect(
      partnerId,
      `failed to create the throwaway partner: ${JSON.stringify(partnerResp)}`
    ).toBeTruthy();

    const projResp = await gql(
      page,
      `mutation { createProject(input:{name:"Playwright FiscalMath ${suffix}", type:MomentumTranslation}) { project { id } } }`
    );
    const projectId = projResp?.data?.createProject?.project?.id;
    expect(projectId, 'failed to create the throwaway project').toBeTruthy();

    const partnershipResp = await gql(
      page,
      `mutation { createPartnership(input:{project:"${projectId}", partner:"${partnerId}", types:[Funding, Managing], financialReportingType:Funded}) { partnership { id } } }`
    );
    const partnershipId =
      partnershipResp?.data?.createPartnership?.partnership?.id;
    expect(
      partnershipId,
      `failed to create the throwaway Funding partnership: ${JSON.stringify(
        partnershipResp
      )}`
    ).toBeTruthy();

    // One-month range straddling Oct 1: FY2025 (Sep) + FY2026 (Oct).
    const dateResp = await gql(
      page,
      `mutation { updateProject(input:{id:"${projectId}", mouStart:"2025-09-15", mouEnd:"2025-10-15"}) { project { id } } }`
    );
    expect(
      dateResp?.errors,
      `expected setting mou dates to succeed: ${JSON.stringify(dateResp)}`
    ).toBeFalsy();
    expect(await recordYears(page, projectId)).toEqual([2025, 2026]);

    // Extend past the next Oct 1 boundary: 2026-10-01 is FY2027, so the
    // sync must add both missing years.
    const extendResp = await gql(
      page,
      `mutation { updateProject(input:{id:"${projectId}", mouEnd:"2026-10-01"}) { project { id } } }`
    );
    expect(
      extendResp?.errors,
      `expected extending mouEnd to succeed: ${JSON.stringify(extendResp)}`
    ).toBeFalsy();
    expect(await recordYears(page, projectId)).toEqual([2025, 2026, 2027]);

    // Shrink back: the diff must REMOVE the now-out-of-range FY2027 record.
    const shrinkResp = await gql(
      page,
      `mutation { updateProject(input:{id:"${projectId}", mouEnd:"2025-10-15"}) { project { id } } }`
    );
    expect(
      shrinkResp?.errors,
      `expected shrinking mouEnd to succeed: ${JSON.stringify(shrinkResp)}`
    ).toBeFalsy();
    expect(await recordYears(page, projectId)).toEqual([2025, 2026]);

    // The UI must agree: one row per fiscal year for the funding partner,
    // and the header total must sum the record amounts.
    await page.goto(`/projects/${projectId}/budget`);
    const rows = page.getByRole('row', { name: new RegExp(orgName, 'u') });
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('[data-field="fiscalYear"]')).toHaveText(
      /2025/u
    );
    await expect(rows.nth(1).locator('[data-field="fiscalYear"]')).toHaveText(
      /2026/u
    );

    const amountCell = rows.nth(0).locator('[data-field="amount"]');
    await amountCell.dblclick();
    await page.keyboard.type('1000');
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateProjectBudgetRecord'),
      page.keyboard.press('Tab'),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected UpdateProjectBudgetRecord to succeed'
    ).toBeFalsy();

    const totalResp = await gql(
      page,
      `query { project(id: "${projectId}") { budget { value { total } } } }`
    );
    expect(totalResp?.data?.project?.budget?.value?.total).toBe(1000);
    await expect(page.getByText(/Total: \$1,000/u)).toBeVisible();

    await gql(
      page,
      `mutation { deletePartnership(id: "${partnershipId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deleteProject(id: "${projectId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deletePartner(id: "${partnerId}") { __typename } }`
    );
  });
});
