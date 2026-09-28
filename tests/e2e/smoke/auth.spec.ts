import { APIRequestContext } from '@playwright/test';
import { API_BASE, waitForOperation } from '../support/graphql';
import { expect, test } from '../support/test';

const post = (
  ctx: APIRequestContext,
  operationName: string,
  query: string,
  variables: Record<string, unknown> = {}
) =>
  ctx.post(`${API_BASE}/graphql/${operationName}`, {
    data: { operationName, query, variables },
  });

/**
 * Round 5 of the comprehensive-coverage push: Auth/session edge flows. This
 * file runs unauthenticated (the "chromium" project — no persona
 * `storageState`), unlike everything else in this suite, since every test
 * here needs to start logged out.
 */
test.describe('auth', () => {
  /**
   * Register has no reachable UI at all — `RegisterForm.tsx`'s entire real
   * form is commented out (since #1793, "disable registration form"),
   * replaced by a static message with no conditional/feature-flag branch.
   * Confirmed via source reading there's no way to re-enable it client-side.
   * `register` itself is still a real, server-enabled mutation
   * (`registrationEnabled` defaults `true` server-side) — exercised for
   * real below, via direct API, as part of the ChangePassword test's setup,
   * since that's the only way to reach it at all in this environment.
   */
  test('register shows the disabled message, not a form', async ({ page }) => {
    await page.goto('/register');
    await expect(
      page.getByText(/User registration is currently disabled/u)
    ).toBeVisible();
    await expect(page.getByLabel('Email')).not.toBeVisible();
  });

  /**
   * `forgotPassword` silently succeeds server-side regardless of whether
   * the email exists (confirmed via source reading
   * `authentication.service.ts`) — the same "Check Your Email" screen
   * shows either way, so a clearly-fake address exercises the real
   * mutation without touching any seeded persona's account.
   */
  test('forgot password requests a reset and shows the check-your-email screen', async ({
    page,
  }) => {
    await page.goto('/forgot-password');
    await page
      .getByLabel('Email')
      .fill('playwright-forgot-password@cordfield.test');
    const [response] = await Promise.all([
      waitForOperation(page, 'ForgotPassword'),
      page.getByRole('button', { name: 'Reset Password' }).click(),
    ]);
    expect(
      (await response.json())?.errors,
      'expected the forgot-password request to succeed'
    ).toBeFalsy();
    await expect(page.getByText('Check Your Email')).toBeVisible();
  });

  /**
   * No client-side token validation exists at all (confirmed via source
   * reading — no query to check a token's validity anywhere in the
   * schema) — an obviously-invalid token hits the real `resetPassword`
   * mutation and gets a real server error (`TokenInvalid`, unmapped on the
   * frontend, falling through to the generic `Default` handler text).
   */
  test('reset password with an invalid token shows a real server error', async ({
    page,
  }) => {
    await page.goto('/reset-password/playwright-garbage-invalid-token');
    await page.getByLabel('New Password').fill('Playwright-Reset-1!');
    await page.getByLabel('Re-Type Password').fill('Playwright-Reset-1!');
    const [response] = await Promise.all([
      waitForOperation(page, 'ResetPassword'),
      page.getByRole('button', { name: 'Save Password' }).click(),
    ]);
    expect(
      (await response.json())?.errors,
      'expected an invalid token to be rejected server-side'
    ).toBeTruthy();
    await expect(
      page.getByText('Something went wrong. Try forgot password again.')
    ).toBeVisible();
  });

  /**
   * `auth.setup.ts` (which every persona-scoped test depends on) logs in
   * via `support/auth.ts`'s `login()` helper, imported straight from
   * `@playwright/test`, not this repo's coverage-tracking `test` fixture —
   * so `Login`/`Session` never show up in `yarn e2e:coverage-report`
   * despite running before every single test invocation. This test exists
   * specifically to give them real, tracked coverage, by logging in (and
   * back out) as a real seeded persona using the tracked fixture directly.
   */
  test('login fires Login and Session, logout fires Logout', async ({
    page,
  }) => {
    await page.goto('/login');
    await page
      .getByLabel(/email/iu)
      .fill('playwright-administrator@cordfield.test');
    const [loginResponse] = await Promise.all([
      waitForOperation(page, 'Login'),
      (async () => {
        await page
          .getByLabel('Password', { exact: true })
          .fill(
            process.env.PLAYWRIGHT_SEED_PASSWORD ?? 'Playwright-Local-Only-1!'
          );
        await page.getByRole('button', { name: 'Sign In' }).click();
      })(),
    ]);
    expect(
      (await loginResponse.json())?.errors,
      'expected login to succeed'
    ).toBeFalsy();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeHidden();

    await page.getByRole('button', { name: /^Profile/u }).click();
    const [logoutResponse] = await Promise.all([
      waitForOperation(page, 'Logout'),
      page.getByRole('menuitem', { name: 'Sign Out' }).click(),
    ]);
    expect(
      (await logoutResponse.json())?.errors,
      'expected logout to succeed'
    ).toBeFalsy();
    await page.waitForURL(/\/login$/u);
  });

  /**
   * ChangePassword must use a throwaway registered-via-API account, never
   * one of the 4 fixed personas — this repo has no per-spec password
   * reseed, so changing a shared persona's real password would break every
   * other spec that logs in as them. `register()` itself logs the
   * *current* session out and attaches the new user instead, so this needs
   * a fresh, separate `request` context (not `page.request`) to avoid
   * disturbing anything — same pattern already established in
   * `projectmanager/users.spec.ts`.
   */
  test('change password with a throwaway account', async ({
    page,
    request,
  }) => {
    const email = `playwright-change-password-${Date.now()}@cordfield.test`;
    const oldPassword = 'Playwright-Throwaway-1!';
    const newPassword = 'Playwright-Throwaway-2!';

    await post(
      request,
      'BootstrapSession',
      'query BootstrapSession($browser: Boolean!) { session(browser: $browser) { token } }',
      { browser: true }
    );
    const registerRes = await post(
      request,
      'RegisterThrowawayUser',
      `mutation RegisterThrowawayUser($input: RegisterUser!) {
        register(input: $input) { user { id } }
      }`,
      {
        input: {
          email,
          password: oldPassword,
          realFirstName: 'Playwright',
          realLastName: 'ChangePassword',
          displayFirstName: 'Playwright',
          displayLastName: 'ChangePassword',
        },
      }
    );
    const registerBody = await registerRes.json();
    const userId = registerBody?.data?.register?.user?.id;
    expect(
      userId,
      `failed to register the throwaway user: ${JSON.stringify(registerBody)}`
    ).toBeTruthy();

    await page.goto('/login');
    await page.getByLabel(/email/iu).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(oldPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeHidden();

    await page.getByRole('button', { name: /^Profile/u }).click();
    await page.getByRole('menuitem', { name: 'Change Password' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Change Password')).toBeVisible();
    await dialog.getByLabel('Old Password').fill(oldPassword);
    // exact — "Re-Type New Password" substring-matches "New Password" too.
    await dialog.getByLabel('New Password', { exact: true }).fill(newPassword);
    await dialog.getByLabel('Re-Type New Password').fill(newPassword);
    const [changeResponse] = await Promise.all([
      waitForOperation(page, 'ChangePassword'),
      dialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(
      (await changeResponse.json())?.errors,
      'expected the password change to succeed'
    ).toBeFalsy();
    await expect(page.getByText('Changed Password Successfully')).toBeVisible();

    // Best-effort cleanup — self-delete isn't a UI-reachable action and its
    // own authorization behavior isn't this test's concern either way.
    await post(
      page.request,
      'DeleteThrowawayUser',
      'mutation DeleteThrowawayUser($id: ID!) { deleteUser(id: $id) { __typename } }',
      { id: userId }
    ).catch(() => null);
  });
});
