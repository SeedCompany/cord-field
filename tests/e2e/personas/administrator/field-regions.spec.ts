import { expect, test } from '../../support/test';

const API_BASE = process.env.RAZZLE_API_BASE_URL ?? 'http://localhost:3000';

/**
 * FieldRegions has no list route (`FieldRegions.tsx` is detail-only,
 * `:fieldRegionId`), so there's no page to click through from — a real ID is
 * fetched directly via the same `InitialFieldRegionOptions` query the app's
 * own FieldRegion lookup/picker issues (`InitialFieldRegionOptions.graphql`).
 *
 * FR1 (pre-cutover-audit-ledger.md: `FieldRegionFilters.id` silently dropped
 * on the Postgres arm, cascading into Project's `filter.fieldRegion`
 * sub-filter — `project.drizzle.repository.ts:769`) has no UI-reachable
 * trigger to regression-test here: the Projects list's only "Field Region"
 * filter is name-based (`FieldRegionNameColumn.tsx` -> plain `textColumn()`,
 * sends `{fieldRegion: {name}}`), and `FieldRegionProjectsPanel` queries
 * `fieldRegion.projects` as a field resolver, never
 * `projects(filter: {fieldRegion: {id}})`. Same shape as RPT-1 — a real,
 * confirmed backend bug that isn't exercised by any real app flow, so this
 * stays a detail-page smoke test rather than an FR1 regression test.
 */
test.describe('field regions (administrator)', () => {
  test('detail page loads for a real field region', async ({ page }) => {
    const lookupRes = await page.request.post(
      `${API_BASE}/graphql/PlaywrightFieldRegionLookup`,
      {
        data: {
          operationName: 'PlaywrightFieldRegionLookup',
          query:
            'query PlaywrightFieldRegionLookup { fieldRegions { items { id name { value } } } }',
        },
      }
    );
    const lookupBody = await lookupRes.json();
    const fieldRegion = lookupBody?.data?.fieldRegions?.items?.[0];
    expect(
      fieldRegion?.id,
      `no field regions returned to look up: ${JSON.stringify(lookupBody)}`
    ).toBeTruthy();

    await page.goto(`/field-regions/${fieldRegion.id}`);

    const heading = page.getByRole('heading', { level: 2 }).first();
    await expect(heading).toBeVisible();
    if (fieldRegion.name?.value) {
      await expect(heading).toHaveText(fieldRegion.name.value);
    }
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
