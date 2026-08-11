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

const createThrowawayProject = async (page: Page, name: string) => {
  await page.goto('/projects');
  const createItemButton = page.getByRole('button', {
    name: 'Create New Item',
  });
  if (!(await createItemButton.isVisible())) {
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    await expect(createItemButton).toBeVisible();
  }
  await createItemButton.click();
  await page.getByRole('menuitem', { name: 'Project', exact: true }).click();

  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Name').fill(name);
  const [response] = await Promise.all([
    waitForOperation(page, 'CreateProject'),
    dialog.getByRole('button', { name: 'Submit' }).click(),
  ]);
  const projectId = (await response.json())?.data?.createProject?.project?.id;
  expect(projectId, 'failed to create the throwaway project').toBeTruthy();
  return projectId as string;
};

const deleteThrowawayProject = (page: Page, projectId: string) =>
  page.request.post(`${API_BASE}/graphql/PlaywrightDeleteProject`, {
    data: {
      operationName: 'PlaywrightDeleteProject',
      query:
        'mutation PlaywrightDeleteProject($id: ID!) { deleteProject(id: $id) { __typename } }',
      variables: { id: projectId },
    },
  });

/**
 * ProjectChangeRequest (Create/Update/Delete) is deliberately NOT covered
 * here despite research suggesting it should be straightforward. Its route
 * is gated behind the `projectChangeRequests` beta feature, confirmed ON
 * for this persona — but `project.changeRequests.canCreate` came back
 * `false` for every project instance tried (a fresh throwaway project, and
 * one bypassed straight to the `Active` step), and no by-role or by-feature
 * policy file for `ProjectChangeRequest` itself turned up in a repo-wide
 * grep — only the beta-flag grant. Whatever actually gates creation isn't
 * "being an Administrator" or "being at a particular project step," and
 * finding it would need cord-api-v3-side investigation, not more UI
 * poking. Flagged for a later round rather than blocking this one.
 */
test.describe('project partnerships (administrator)', () => {
  /**
   * Round 3 of the comprehensive-coverage push: linking an existing
   * (real, not self-created) Partner to a throwaway Project, then
   * unlinking it again — CreatePartnership/UpdatePartnership/
   * DeletePartnership all have real UI delete/edit affordances, confirmed
   * via research before writing this. The Partner itself is never
   * mutated, only the Partnership join record.
   */
  test('add, update, and remove a partnership', async ({ page }) => {
    const projectId = await createThrowawayProject(
      page,
      `Playwright Partnership ${Date.now().toString(36)}`
    );

    await page.goto(`/projects/${projectId}/partnerships`);
    await page.getByRole('button', { name: 'add partnership' }).click();

    const createDialog = page.getByRole('dialog');
    await expect(createDialog.getByText('Create Partnership')).toBeVisible();
    // A real, distinctive seeded partner name (fetched live before writing
    // this test) — PartnerField is search-only, no pre-populated options.
    await createDialog
      .getByLabel('Partner')
      .fill('Trantow, Hansen and Johnson 2cd0f7af67');
    const partnerOption = page.getByRole('option', {
      name: 'Trantow, Hansen and Johnson 2cd0f7af67',
    });
    await expect(partnerOption).toBeVisible();
    await partnerOption.click();

    const [createResponse] = await Promise.all([
      waitForOperation(page, 'CreatePartnership'),
      createDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createBody = await createResponse.json();
    expect(
      createBody?.data?.createPartnership?.partnership?.id,
      `failed to create the partnership: ${JSON.stringify(createBody)}`
    ).toBeTruthy();
    await expect(createDialog).not.toBeVisible();

    await page.getByRole('button', { name: 'Edit' }).first().click();
    const editDialog = page.getByRole('dialog');
    await expect(editDialog.getByText(/^Edit Partnership/u)).toBeVisible();

    // EditPartnership sets `sendIfClean="delete"` — a clean-form Submit
    // (no `submitAction`) silently no-ops (`Form.tsx`'s own submit gate),
    // so an actual field change is needed to really exercise the mutation.
    // Not "Set primary" — the first partnership on a project is
    // apparently auto-primary, so that switch doesn't even render here.
    // "Resource" avoids the "Managing" type's extra conditional field.
    await editDialog.getByLabel('Resource').click();
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdatePartnership'),
      editDialog.getByRole('button', { name: 'Submit', exact: true }).click(),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected the no-op partnership update to succeed'
    ).toBeFalsy();
    await expect(editDialog).not.toBeVisible();

    await page.getByRole('button', { name: 'Edit' }).first().click();
    await expect(editDialog.getByText(/^Edit Partnership/u)).toBeVisible();
    const [deleteResponse] = await Promise.all([
      waitForOperation(page, 'DeletePartnership'),
      editDialog.getByRole('button', { name: 'Delete' }).click(),
    ]);
    expect(
      (await deleteResponse.json())?.errors,
      'expected deleting the partnership to succeed'
    ).toBeFalsy();

    await deleteThrowawayProject(page, projectId);
  });
});
