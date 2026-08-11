import { test as setup } from '@playwright/test';
import { login } from './support/auth';
import {
  authFileFor,
  credentialsForPersona,
  PERSONAS,
} from './support/personas';

for (const persona of PERSONAS) {
  setup(`authenticate as ${persona}`, async ({ page }) => {
    await login(page, credentialsForPersona(persona));
    await page.context().storageState({ path: authFileFor(persona) });
  });
}
