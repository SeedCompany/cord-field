import { waitForOperation } from '../support/graphql';
import { expect, test } from '../support/test';

/**
 * Round 11 (depth): before this round, exactly one test in the suite asserted
 * a server error path (the invalid reset token). This locks down the login
 * failure contract: the API rejects bad credentials with an Unauthenticated
 * error (not a null user), and `Login.tsx`'s `handleFormError` Default
 * handler renders it as the blanket form-level `SubmitError` alert — the
 * exact copy is asserted so a change to either side (API error shape or the
 * client mapping) fails loudly. Migration-relevant because the error *shape*
 * crossing the boundary is what the client mapping keys on; a Postgres-side
 * auth rewrite that returned a different code would silently break this UX.
 */
test.describe('login error paths', () => {
  test('invalid credentials surface the blanket form error and stay on /login', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByLabel(/email/iu).fill('playwright-nobody@cordfield.test');
    // Exact match — a loose /password/i regex also catches the "Toggle
    // password visibility" button (same gotcha as support/auth.ts).
    await page
      .getByLabel('Password', { exact: true })
      .fill('Definitely-Wrong-1!');

    const [loginResponse] = await Promise.all([
      waitForOperation(page, 'Login'),
      page.getByRole('button', { name: 'Sign In' }).click(),
    ]);
    const body = await loginResponse.json();
    expect(
      body?.errors?.length,
      'expected the Login mutation itself to return an error for bad credentials'
    ).toBeGreaterThan(0);

    await expect(
      page.getByText(`Something wasn't right. Try again, or reset password.`)
    ).toBeVisible();
    expect(page.url()).toContain('/login');
  });
});
