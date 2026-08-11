import { expect, test } from '../../support/test';

/**
 * First real mutation-through-a-form coverage for the Users domain (the
 * existing users.spec.ts only exercises the raw deleteUser mutation via
 * page.request, not a real form flow). Edits the "About" field — a free-text
 * bio with no cascading effects on any other fixture — on whichever user the
 * Users list shows first, same "click the first row" convention used
 * throughout this suite.
 */
test.describe('user edit (administrator)', () => {
  test("can edit a user's About field", async ({ page }) => {
    await page.goto('/users');

    const main = page.getByRole('main');
    await main.getByRole('link').first().click();
    await page.waitForURL(/\/users\/[^/]+$/u);

    await page.getByRole('button', { name: 'edit person' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const aboutField = dialog.getByLabel('About');
    await aboutField.fill(`Playwright edit check — ${Date.now()}`);

    await dialog.locator('button[type="submit"]').click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
