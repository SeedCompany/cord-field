import { API_BASE } from '../../support/graphql';
import { expect, test } from '../../support/test';

/**
 * Same shape as field-regions.spec.ts: FieldZones has no list route
 * (`FieldZones.tsx` is detail-only, `:fieldZoneId`), so a real ID is fetched
 * directly via `InitialFieldZoneOptions` (the same query the app's own
 * FieldZone lookup/picker issues) rather than clicking through a list.
 *
 * The ledger calls zone.e2e "clean, zero skips" in contrast to FieldRegion's
 * FR1/FR2 — no known-open finding to target here, so this is a plain detail
 * smoke test.
 */
test.describe('field zones (administrator)', () => {
  test('detail page loads for a real field zone', async ({ page }) => {
    const lookupRes = await page.request.post(
      `${API_BASE}/graphql/PlaywrightFieldZoneLookup`,
      {
        data: {
          operationName: 'PlaywrightFieldZoneLookup',
          query:
            'query PlaywrightFieldZoneLookup { fieldZones { items { id name { value } } } }',
        },
      }
    );
    const lookupBody = await lookupRes.json();
    const fieldZone = lookupBody?.data?.fieldZones?.items?.[0];
    expect(
      fieldZone?.id,
      `no field zones returned to look up: ${JSON.stringify(lookupBody)}`
    ).toBeTruthy();

    await page.goto(`/field-zones/${fieldZone.id}`);

    const heading = page.getByRole('heading', { level: 2 }).first();
    await expect(heading).toBeVisible();
    if (fieldZone.name?.value) {
      await expect(heading).toHaveText(fieldZone.name.value);
    }
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
