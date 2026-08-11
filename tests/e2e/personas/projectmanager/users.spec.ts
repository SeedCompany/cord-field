import { APIRequestContext } from '@playwright/test';
import { expect, test } from '../../support/test';

const API_BASE = process.env.RAZZLE_API_BASE_URL ?? 'http://localhost:3000';

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
 * U1 (cord-api-v3's migration-todo-ledger.md, filed open since 2026-07-13):
 * under Postgres, `deleteUser` was reported to have no permission check at
 * all — any authenticated session could soft-delete any user. There's no
 * delete-user button anywhere in cord-field — the only way to exercise this
 * is directly against the GraphQL API, which is also, not coincidentally,
 * exactly how a real exploit of this bug would look.
 *
 * As of this session, deleting a peer user this way is correctly denied
 * (`UnauthorizedException` from `UserDrizzleRepository.delete`,
 * `user.drizzle.repository.ts:234`) — verified directly via curl before
 * trusting this test's own green result. That means either U1 is fixed and
 * the ledger just hasn't been updated, or U1's "including root admin" half
 * is a narrower, still-open case this test doesn't cover — deleting the
 * actual seeded Administrator persona to check that would break every other
 * spec that depends on it logging in, so it isn't attempted here. Worth
 * relaying back to whoever owns that ledger rather than assuming it's fully
 * resolved. Kept as a permanent regression test either way — this is exactly
 * the behavior that should hold going forward.
 */
test.describe('users (projectmanager)', () => {
  test('cannot delete another user', async ({ page, request }) => {
    // A fresh, anonymous request context — deliberately not page's, since
    // register() logs the current session out and attaches the new user
    // instead, which would blow away the already-authenticated
    // ProjectManager persona this test needs for the actual delete attempt.
    const email = `playwright-throwaway-${Date.now()}@cordfield.test`;
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
          password: 'Playwright-Throwaway-1!',
          realFirstName: 'Playwright',
          realLastName: 'Throwaway',
          displayFirstName: 'Playwright',
          displayLastName: 'Throwaway',
        },
      }
    );
    const registerBody = await registerRes.json();
    const targetUserId = registerBody?.data?.register?.user?.id;
    expect(
      targetUserId,
      `failed to create throwaway target user: ${JSON.stringify(registerBody)}`
    ).toBeTruthy();

    // page.request shares ProjectManager's already-authenticated cookies.
    const deleteRes = await post(
      page.request,
      'DeleteThrowawayUser',
      'mutation DeleteThrowawayUser($id: ID!) { deleteUser(id: $id) { __typename } }',
      { id: targetUserId }
    );
    const deleteBody = await deleteRes.json();

    expect(
      deleteBody.errors,
      'ProjectManager should NOT be able to delete another user — see U1 in ' +
        "cord-api-v3's migration-todo-ledger.md. If this fails (no `errors` " +
        'in the response), U1 has regressed — treat as a real bug, not a ' +
        'flaky test.'
    ).toBeTruthy();
  });
});
