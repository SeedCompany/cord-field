import { TestUserCredentials } from './auth';

/**
 * Keep in sync with cord-api-v3's src/core/seed-playwright-personas.run.ts —
 * same role list, same `playwright-<role>@cordfield.test` pattern, same
 * PLAYWRIGHT_SEED_PASSWORD env var name. No shared config file between the
 * two repos, so this list has to be kept in sync by hand.
 */
export const PERSONAS = [
  'administrator',
  'projectmanager',
  'fieldpartner',
  'intern',
] as const;

export type Persona = (typeof PERSONAS)[number];

const SEED_PASSWORD =
  process.env.PLAYWRIGHT_SEED_PASSWORD ?? 'Playwright-Local-Only-1!';

export const credentialsForPersona = (
  persona: Persona
): TestUserCredentials => ({
  email: `playwright-${persona}@cordfield.test`,
  password: SEED_PASSWORD,
});

export const authFileFor = (persona: Persona) =>
  `tests/e2e/.auth/${persona}.json`;
