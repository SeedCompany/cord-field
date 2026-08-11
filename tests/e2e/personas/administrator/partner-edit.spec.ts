import { expect, test } from '../../support/test';

/**
 * The header "Edit Partner" action on a partner's detail page scopes its
 * form to `organization.name`/`organization.acronym`/
 * `partner.globalInnovationsClient` (PartnerDetail.tsx) — despite there
 * being no dedicated updateOrganization call in cord-field's own generated
 * operations, organization fields DO get edited through the app, bundled
 * into the single `updatePartner` mutation (EditPartner.tsx passes both
 * `partner` and `organization` variables together). This is real coverage
 * of the organization-editing path the PART-2/OR-sensitivity ledger findings
 * are about, even though there's no standalone Organization scene.
 */
test.describe('partner edit (administrator)', () => {
  test('can edit the organization acronym via the partner header', async ({
    page,
  }) => {
    await page.goto('/partners');

    const main = page.getByRole('main');
    await main.getByRole('link').first().click();
    await page.waitForURL(/\/partners\/[^/]+$/u);

    await page.getByRole('button', { name: 'Edit Partner' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const acronymField = dialog.getByLabel('Acronym');
    await acronymField.fill(`PW${Date.now().toString().slice(-6)}`);

    await dialog.locator('button[type="submit"]').click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
