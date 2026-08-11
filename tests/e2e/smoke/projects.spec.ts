import { expect, test } from '../support/test';

test.describe('projects smoke', () => {
  test('loads the projects entry point', async ({ page }) => {
    await page.goto('/projects');

    await expect(page).toHaveTitle(/Projects|CORD/u);
    await expect(
      page
        .getByRole('tab', { name: 'Projects' })
        .or(page.getByRole('button', { name: 'Sign In' }))
    ).toBeVisible();
  });
});
