import { API_BASE, waitForOperation } from '../../support/graphql';
import { expect, test } from '../../support/test';

/**
 * LP-7 (pre-cutover-audit-ledger.md, 2026-07-28): Location's `isoAlpha3`
 * had a partial-unique constraint under Postgres with no Neo4j equivalent,
 * and duplicate violations came back as an unmapped raw error instead of a
 * friendly `DuplicateException`. Went looking for that here — and found
 * it's since been overtaken by a bigger decision, not a smaller fix:
 * migration `0030_relax_name_and_code_uniqueness.sql` DROPS
 * `locations_iso_alpha3_active_unique` entirely. Its own header explains
 * why: seeded/real data never actually had unique isoAlpha3 values (many
 * Locations legitimately share a country), so the constraint was rejecting
 * valid data, not catching bad data — "the data does not have it," and the
 * fix is documented as intentionally NOT restoring uniqueness even if
 * someone finds it declared in the Gel schema later.
 *
 * So LP-7 as originally described can't be reproduced — there's no longer a
 * uniqueness violation to unmap. What's worth a permanent regression test
 * instead is the new intended contract: creating two Locations with the
 * same isoAlpha3 code both succeed, with no error at all. If that
 * constraint ever gets reintroduced by accident (e.g. a future migration
 * restoring it "for correctness" without reading this history), this is
 * what catches it.
 *
 * Self-created data only: creates two throwaway Locations sharing one real
 * ISO-3166-1 alpha-3 code via the app's real "Create New Item" menu (the
 * only UI entry point for CreateLocation — there's no locations list to
 * click an "add" button from). No delete action exists anywhere in the UI
 * for Location, so cleanup goes directly through `deleteLocation` via the
 * API instead — same reasoning as `users.spec.ts`'s U1 test.
 */
test.describe('locations (administrator)', () => {
  test('two locations can share the same isoAlpha3 code', async ({ page }) => {
    const suffix = Date.now().toString(36);
    // A real but obscure ISO-3166-1 alpha-3 code (Tuvalu) — real codes are
    // validated client-side before reaching the DB at all, but an obscure
    // one keeps this test from depending on whatever common codes existing
    // seed data happens to already use.
    const isoAlpha3 = 'TUV';

    const createLocation = async (name: string) => {
      // The nav drawer stays open after the first use (it's not a
      // temporary/modal drawer on this app), so only open it if it isn't
      // already — clicking the hamburger again while it's open just gets
      // occluded by the drawer's own backdrop.
      const createItemButton = page.getByRole('button', {
        name: 'Create New Item',
      });
      if (!(await createItemButton.isVisible())) {
        await page
          .getByRole('button', { name: 'Open navigation menu' })
          .click();
        await expect(createItemButton).toBeVisible();
      }
      await createItemButton.click();
      await page
        .getByRole('menuitem', { name: 'Location', exact: true })
        .click();

      const dialog = page.getByRole('dialog');
      await expect(dialog.getByText('Create Location')).toBeVisible();
      await dialog.getByLabel('Location Name').fill(name);
      await dialog.getByLabel('ISO Alpha-3 Country Code').fill(isoAlpha3);

      const [response] = await Promise.all([
        waitForOperation(page, 'CreateLocation'),
        dialog.getByRole('button', { name: 'Submit' }).click(),
      ]);
      return await response.json();
    };

    await page.goto('/projects');

    const firstBody = await createLocation(`Playwright LP-7 A ${suffix}`);
    const locationAId = firstBody?.data?.createLocation?.location?.id;
    expect(
      locationAId,
      `failed to create the first throwaway location: ${JSON.stringify(
        firstBody
      )}`
    ).toBeTruthy();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    const secondBody = await createLocation(`Playwright LP-7 B ${suffix}`);
    const locationBId = secondBody?.data?.createLocation?.location?.id;
    expect(
      locationBId,
      'a second location with the same isoAlpha3 code should succeed too ' +
        `(migration 0030 dropped that uniqueness on purpose): ${JSON.stringify(
          secondBody
        )}`
    ).toBeTruthy();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    const cleanup = (id: string) =>
      page.request.post(`${API_BASE}/graphql/PlaywrightDeleteLocation`, {
        data: {
          operationName: 'PlaywrightDeleteLocation',
          query:
            'mutation PlaywrightDeleteLocation($id: ID!) { deleteLocation(id: $id) { __typename } }',
          variables: { id },
        },
      });
    await cleanup(locationAId);
    await cleanup(locationBId);
  });
});
