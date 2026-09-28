import { waitForOperation } from '../../support/graphql';
import { expect, test } from '../../support/test';

/**
 * Round 6 of the comprehensive-coverage push: the header search box
 * (`HeaderSearch.tsx`). On this suite's mobile viewport it's collapsed to
 * an icon button that expands into the real field on click (confirmed via
 * source reading — desktop shows the field always). It's submit-driven
 * (Enter key — there's no visible submit button), not keystroke-driven: no
 * debounce or dropdown to wait out, just a real navigation to `/search?q=`
 * once submitted.
 */
test.describe('search (administrator)', () => {
  test('searching a real seeded language navigates to results', async ({
    page,
  }) => {
    await page.goto('/projects');
    await page.getByRole('button', { name: 'Search' }).click();

    const searchField = page.getByPlaceholder('Search');
    await expect(searchField).toBeVisible();
    await searchField.fill('scared-31171d');

    const [response] = await Promise.all([
      waitForOperation(page, 'Search'),
      page.waitForURL(/\/search\?q=/u),
      searchField.press('Enter'),
    ]);
    const body = await response.json();
    expect(
      body?.errors,
      `expected the search to succeed: ${JSON.stringify(body)}`
    ).toBeFalsy();
    await expect(page.getByText('scared-31171d').first()).toBeVisible();
  });
});
