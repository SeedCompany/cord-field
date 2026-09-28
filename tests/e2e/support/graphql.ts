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

/** Operations ride a `/graphql/{operationName}` URL — same shape test.ts tracks. */
const GRAPHQL_OPERATION_URL = /\/graphql\/([^/?]+)/u;

/**
 * Wait for a named GraphQL operation's response.
 *
 * Matches the operation name as a whole path segment, not a substring: many
 * of ours are prefixes of each other (`CreateProject` vs
 * `CreateProjectMember`/`CreateProjectChangeRequest`/`CreateProjectDirectory`,
 * `UpdatePartnership` vs `UpdatePartnershipsProducingMediums`), and an
 * `includes()` check resolves on whichever fires first — handing the caller a
 * body that has no such field on it.
 *
 * Skips `PersistedQueryNotFound` replies: the client sends a hash first and
 * only retries with the full document on a miss, so without this filter we'd
 * resolve on the handshake and read a body with no data in it.
 */
export const waitForOperation = (
  page: Page,
  name: string,
  options?: { timeout?: number }
) =>
  page.waitForResponse(async (res) => {
    if (GRAPHQL_OPERATION_URL.exec(res.url())?.[1] !== name) return false;
    // @live operations answer as a long-lived text/event-stream on this same
    // URL shape; res.json() on one hangs for the life of the page rather than
    // rejecting, so never await a body that isn't JSON (see test.ts).
    const contentType = res.headers()['content-type'] ?? '';
    if (!contentType.includes('application/json')) return true;
    const body = await res.json().catch(() => null);
    return !(
      body?.errors?.length === 1 &&
      body.errors[0]?.message === 'PersistedQueryNotFound'
    );
  }, options);
