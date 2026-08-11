import { expect, test } from '../../support/test';

/**
 * FieldPartner is a member-scoped role — visibility depends entirely on
 * project membership rather than a broad grant, which is exactly the shape
 * that let the PART-1/OR1 `scope`-population bugs through undetected during
 * the Postgres migration (see cord-api-v3's migration-tracker.md). Run this
 * against both DATABASE=neo4j and DATABASE=postgres backends and diff the
 * results — a pass on Neo4j alone doesn't confirm anything about parity.
 */
test.describe('fieldpartner visibility', () => {
  test('can see and open their own project, and its partnerships', async ({
    page,
  }) => {
    await page.goto('/projects');

    const main = page.getByRole('main');
    const projectLink = main.getByRole('link').first();
    await expect(projectLink).toBeVisible();
    await projectLink.click();

    await page.waitForURL(/\/projects\/[^/]+$/u);
    const heading = page.getByRole('heading', { level: 2 }).first();
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();

    const partnershipsLink = page.getByRole('link', {
      name: /Partnerships/u,
    });
    await expect(partnershipsLink).toBeVisible();
    await partnershipsLink.click();

    await page.waitForURL(/\/projects\/[^/]+\/partnerships$/u);
    await expect(page).toHaveTitle(/Partnerships/u);
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
