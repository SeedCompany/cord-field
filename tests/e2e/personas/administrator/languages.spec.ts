import { expect, test } from '../../support/test';

test.describe('languages (administrator)', () => {
  test('list loads and a language detail page opens', async ({ page }) => {
    await page.goto('/languages');

    const main = page.getByRole('main');
    await expect(main.getByText(/Total Rows/u)).toBeVisible();

    const languageLink = main.getByRole('link').first();
    await expect(languageLink).toBeVisible();
    await languageLink.click();

    await page.waitForURL(/\/languages\/[^/]+$/u);
    const heading = page.getByRole('heading', { level: 2 }).first();
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
