import { expect, test } from '../../support/test';

/**
 * Organizations don't have their own route in this app (no /organizations
 * scene exists) — a Partner's detail heading IS its organization's name
 * (PartnerDetail.tsx reads `partner.organization.value.name.value`
 * directly), so this doubles as the organization-visibility check per the
 * plan. PART-1/OR1 (dead `scope` on the Drizzle side) and the PART-2
 * sensitivity-hardcoded-'High' bug would most plausibly surface here, though
 * a specific wrong-value assertion needs a fixture we don't have a way to
 * identify yet — this stays a smoke check (loads, heading populates, no
 * redaction/crash) rather than a value assertion.
 */
test.describe('partners (administrator)', () => {
  test('list loads and a partner detail page opens with its organization name', async ({
    page,
  }) => {
    await page.goto('/partners');

    const main = page.getByRole('main');
    await expect(main.getByText(/Total Rows/u)).toBeVisible();

    const partnerLink = main.getByRole('link').first();
    await expect(partnerLink).toBeVisible();
    await partnerLink.click();

    await page.waitForURL(/\/partners\/[^/]+$/u);
    const heading = page.getByRole('heading', { level: 2 }).first();
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
