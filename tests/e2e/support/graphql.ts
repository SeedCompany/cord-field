import { Page } from '@playwright/test';

/**
 * The API origin. Specs talk to it directly for setup, teardown, and for
 * asserting on operations the UI fires.
 *
 * Shares `RAZZLE_API_BASE_URL` with the app itself so pointing the suite at
 * another environment only takes the one variable.
 */
export const API_BASE =
  process.env.RAZZLE_API_BASE_URL ?? 'http://localhost:3000';

/** Fire a raw GraphQL query using the page's authenticated request context. */
export const gql = (page: Page, query: string) =>
  page.request
    .post(`${API_BASE}/graphql`, { data: { query } })
    .then((res) => res.json());

/**
 * Wait for a named GraphQL operation's response.
 *
 * Skips `PersistedQueryNotFound` replies: the client sends a hash first and
 * only retries with the full document on a miss, so without this filter we'd
 * resolve on the handshake and read a body with no data in it.
 */
export const waitForOperation = (page: Page, name: string) =>
  page.waitForResponse(async (res) => {
    if (!res.url().includes(`/graphql/${name}`)) return false;
    const body = await res.json().catch(() => null);
    return !(
      body?.errors?.length === 1 &&
      body.errors[0]?.message === 'PersistedQueryNotFound'
    );
  });
