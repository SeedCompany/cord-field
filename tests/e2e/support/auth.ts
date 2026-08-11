import { expect, Page } from '@playwright/test';

export interface TestUserCredentials {
  email: string;
  password: string;
}

export const credentialsFromEnv = (): TestUserCredentials => {
  const { PLAYWRIGHT_USER_EMAIL: email, PLAYWRIGHT_USER_PASSWORD: password } =
    process.env;

  if (!email || !password) {
    throw new Error(
      'Set PLAYWRIGHT_USER_EMAIL and PLAYWRIGHT_USER_PASSWORD before running authenticated e2e tests.'
    );
  }

  return { email, password };
};

export const login = async (page: Page, credentials = credentialsFromEnv()) => {
  await page.goto('/login');
  await page.getByLabel(/email/iu).fill(credentials.email);
  // Exact match — a loose /password/i regex also catches the "Toggle
  // password visibility" show/hide button rendered next to the field.
  await page.getByLabel('Password', { exact: true }).fill(credentials.password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByRole('button', { name: 'Sign In' })).toBeHidden();
};
