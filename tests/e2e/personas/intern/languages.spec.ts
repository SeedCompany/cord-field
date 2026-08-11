import { expect, test } from '../../support/test';

/**
 * cord-api-v3's InternPolicy gates Language read entirely behind
 * `.when(member)` — Intern has no grant otherwise. Our seeded Intern persona
 * is deliberately a member of nothing, so the list here should be empty.
 *
 * This is a boundary check, not a direct test of the LANG-1 finding in
 * cord-api-v3's audit ledger (member-read omitting a *soft-deleted-project*
 * liveness check, leaking rows from a project Intern used to belong to) —
 * that needs an Intern who WAS a member of a since-deleted project, a fixture
 * this persona doesn't have. What this does confirm: the basic
 * member-gate itself still holds under Postgres, which LANG-1 is a bug
 * *within*, not a replacement for.
 */
test.describe('languages (intern)', () => {
  test('sees no languages, having no project membership', async ({ page }) => {
    await page.goto('/languages');

    const main = page.getByRole('main');
    const totalRows = main.getByText(/Total Rows/u);
    await expect(totalRows).toBeVisible();
    await expect(totalRows).toContainText('0');
    await expect(main.getByRole('link')).toHaveCount(0);
  });
});
