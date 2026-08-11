import { expect, test } from '../../support/test';

/**
 * Real UpdateLanguage mutation coverage — edits the "Pronunciation Guide"
 * field (low-risk free text) on whichever language the list shows first.
 */
test.describe('language edit (administrator)', () => {
  test("can edit a language's pronunciation guide", async ({ page }) => {
    await page.goto('/languages');

    const main = page.getByRole('main');
    await main.getByRole('link').first().click();
    await page.waitForURL(/\/languages\/[^/]+$/u);

    await page.getByRole('button', { name: 'edit language' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const pronunciationField = dialog.getByLabel('Pronunciation Guide');
    await pronunciationField.fill(`Playwright edit check ${Date.now()}`);

    await dialog.locator('button[type="submit"]').click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
