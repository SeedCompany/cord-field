import { expect, test } from '../../support/test';

/**
 * Products ("Goals" in the UI — see ProductDetailHeader.tsx's breadcrumb) has
 * no list route of its own; it's only reachable from a LanguageEngagement's
 * "Goals" section. PRD-1 (pre-cutover-audit-ledger.md: product `readMany`/
 * `list` don't correlate parent project/engagement liveness under Postgres)
 * is a still-open API-contract decision, not a fix — same shape as TU-3/TU-4
 * — and would need soft-deleting a real project/engagement to observe, which
 * breaks the mutation-safety rule (only touch self-created data). Smoke
 * coverage only for now.
 */
test.describe('products (administrator)', () => {
  test('a goal opens from its engagement without error', async ({ page }) => {
    await page.goto('/projects');
    const main = page.getByRole('main');
    await main.getByRole('link').first().click();
    await page.waitForURL(/\/projects\/[^/]+$/u);

    await page.getByRole('link', { name: 'View Details' }).first().click();
    await page.waitForURL(/\/engagements\/[^/]+$/u);

    // Not `getByRole('heading', ...)` — this particular label is a
    // `Grid item component={Typography} variant="h3"`, and Grid doesn't
    // forward the unrecognized `variant` prop to Typography, so it renders
    // as plain untagged text rather than an actual `<h3>` (unlike the
    // "Tools" section right above it, a plain `<Typography variant="h3">`).
    await expect(page.getByText('Goals', { exact: true })).toBeVisible();

    const productLink = page.locator('a[href^="/products/"]').first();
    await expect(productLink).toBeVisible();
    await productLink.click();

    await page.waitForURL(/\/products\/[^/]+$/u);
    const heading = page.getByRole('heading', { level: 2 }).first();
    await expect(heading).toBeVisible();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
