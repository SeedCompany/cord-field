import { Page } from '@playwright/test';
import { expect, test } from '../../support/test';

const API_BASE = process.env.RAZZLE_API_BASE_URL ?? 'http://localhost:3000';

const waitForOperation = (page: Page, name: string) =>
  page.waitForResponse(async (res) => {
    if (!res.url().includes(`/graphql/${name}`)) return false;
    const body = await res.json().catch(() => null);
    return !(
      body?.errors?.length === 1 &&
      body.errors[0]?.message === 'PersistedQueryNotFound'
    );
  });

const gql = (page: Page, query: string) =>
  page.request
    .post(`${API_BASE}/graphql`, { data: { query } })
    .then((res) => res.json());

/**
 * Round 8 (final sweep) of the comprehensive-coverage push: ProjectChangeRequest
 * (`Create`/`Update`/`Delete`) + `ChangesetDiff`, deliberately dropped from
 * Round 3 after `project.changeRequests.canCreate` came back `false` for
 * every project tried, including one bypassed straight to the "Active" step
 * — a repo-wide grep found only a beta-feature-gated policy with an empty
 * grant, no resource-level authorization for `ProjectChangeRequest` at all.
 *
 * Two real facts, both confirmed live this round, not guessed:
 *
 * 1. `canCreate` isn't gated by authorization at all — it's a plain business
 *    rule in `ProjectService.listChangeRequests()`:
 *    `canCreate: project.status === ProjectStatus.Active`. Round 3's bypass
 *    never actually reached `Active`: that status requires `primaryLocation`
 *    (itself requiring a Location with a `FundingAccount` already attached —
 *    a second business rule, "Cannot connect location without a funding
 *    account") and `mouStart`/`mouEnd` to already be set BEFORE the step
 *    transition succeeds (`RequiredWhen` validation on `TransitionProject`).
 *    Skip any of those and the transition fails with a real, checkable error
 *    — which Round 3's test never checked, so the project silently stayed
 *    `InDevelopment` and `canCreate: false` was the CORRECT answer for a
 *    project that was never actually `Active`, not a missing permission.
 * 2. Once a project genuinely reaches `Active` and `canCreate` flips to
 *    `true`, actually calling `createProjectChangeRequest` still fails —
 *    deliberately. `ProjectChangeRequestDrizzleRepository`'s own doc comment
 *    is explicit: "Changesets are NOT being carried forward to Postgres —
 *    there is no project_change_requests table and no plan for one." `list()`
 *    truthfully returns empty (so `Project.changeRequests` doesn't crash a
 *    page load), but `create`/`update`/`deleteNode` all throw
 *    `NotImplementedException`. So `UpdateProjectChangeRequest`,
 *    `DeleteProjectChangeRequest`, and `ChangesetDiff` (which needs an
 *    existing changeset id to view — `readOne` always throws `NotFound`,
 *    `list` is always empty) are permanently unreachable under Postgres too,
 *    by design, not a gap to chase.
 *
 * This test is a permanent regression tripwire for BOTH facts: the real
 * business rule that flips `canCreate` (proven by reaching it for real,
 * correcting Round 3's misdiagnosis), and the deliberate Postgres-side block
 * (proven by attempting the real UI create flow and confirming it fails with
 * exactly this reason, not some other regression). If this ever starts
 * succeeding, that's a signal the changeset feature quietly got re-enabled
 * without anyone building out the actual Postgres-side support.
 *
 * `primaryLocation`/`mouStart`/`mouEnd`/the step transition are all set up
 * here via direct API calls (setup only — `UpdateProject`/`TransitionProject`
 * already have their own real UI-driven coverage in
 * `project-lifecycle.spec.ts`), so this spec's own UI-driven steps stay
 * focused on what it actually targets: the Change Requests page and the
 * real create attempt.
 */
test.describe('project change requests (administrator)', () => {
  test('canCreate flips true at Active status, but creating one still fails — changesets are not ported to Postgres', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);

    const locResp = await gql(
      page,
      `mutation { createLocation(input:{name:"Playwright PCR Location ${suffix}", isoAlpha3:"TUV", type:Country}) { location { id } } }`
    );
    const locationId = locResp?.data?.createLocation?.location?.id;
    expect(locationId, 'failed to create the throwaway location').toBeTruthy();

    const faResp = await gql(
      page,
      `mutation { createFundingAccount(input:{name:"Playwright PCR Funding Account ${suffix}", accountNumber:5}) { fundingAccount { id } } }`
    );
    const fundingAccountId =
      faResp?.data?.createFundingAccount?.fundingAccount?.id;
    expect(
      fundingAccountId,
      'failed to create the throwaway funding account'
    ).toBeTruthy();

    await gql(
      page,
      `mutation { updateLocation(input:{id:"${locationId}", fundingAccount:"${fundingAccountId}"}) { location { id } } }`
    );

    const projResp = await gql(
      page,
      `mutation { createProject(input:{name:"Playwright PCR ${suffix}", type:MomentumTranslation}) { project { id } } }`
    );
    const projectId = projResp?.data?.createProject?.project?.id;
    expect(projectId, 'failed to create the throwaway project').toBeTruthy();

    // Setup only, via direct API — `UpdateProject`/`TransitionProject` already
    // have their own real UI-driven coverage in project-lifecycle.spec.ts.
    const updateResp = await gql(
      page,
      `mutation { updateProject(input:{id:"${projectId}", primaryLocation:"${locationId}", mouStart:"2025-01-01", mouEnd:"2026-12-31"}) { project { id } } }`
    );
    expect(
      updateResp?.errors,
      `expected setting primaryLocation/mou dates to succeed: ${JSON.stringify(
        updateResp
      )}`
    ).toBeFalsy();

    const transitionResp = await gql(
      page,
      `mutation { transitionProject(input:{project:"${projectId}", bypassTo: Active}) { project { id status } } }`
    );
    expect(
      transitionResp?.errors,
      `expected the project to reach Active status: ${JSON.stringify(
        transitionResp
      )}`
    ).toBeFalsy();
    expect(transitionResp?.data?.transitionProject?.project?.status).toBe(
      'Active'
    );

    await page.goto(`/projects/${projectId}/change-requests`);
    // Real, UI-driven confirmation of the business rule above — the Fab is
    // conditioned on `changeRequests.canCreate`, which is only `true` because
    // this project genuinely reached `Active` status.
    const createCrButton = page.getByRole('button', {
      name: 'Create Change Request',
    });
    await expect(createCrButton).toBeVisible();
    await createCrButton.click();

    const crDialog = page.getByRole('dialog');
    await expect(crDialog.getByText('Create Change Request')).toBeVisible();
    await crDialog.getByLabel('Types').click();
    await page.getByRole('option', { name: 'Budget', exact: true }).click();
    await page.keyboard.press('Escape');
    await crDialog
      .getByLabel('Summary')
      .fill('Playwright change request summary');

    const [createCrResponse] = await Promise.all([
      waitForOperation(page, 'CreateProjectChangeRequest'),
      crDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createCrBody = await createCrResponse.json();
    expect(
      createCrBody?.errors?.[0]?.message,
      `expected the real, deliberate Postgres-side block, got: ${JSON.stringify(
        createCrBody
      )}`
    ).toContain('Change requests are not supported under Postgres');

    await gql(
      page,
      `mutation { deleteProject(id: "${projectId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deleteLocation(id: "${locationId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deleteFundingAccount(id: "${fundingAccountId}") { __typename } }`
    );
  });
});
