import { API_BASE, waitForOperation } from '../../support/graphql';
import { expect, test } from '../../support/test';

/**
 * Round 3 of the comprehensive-coverage push: a throwaway Project's Team
 * Members tab, exercising CreateProjectMember, UpdateProjectMember (which
 * fires GetUserRoles as a side effect when its dialog opens), and
 * DeleteProjectMember — all real UI actions.
 *
 * Uses the seeded Intern persona as the throwaway member. Adding/removing a
 * project membership doesn't touch Intern's own account, and Intern isn't
 * a member of this brand-new project to begin with, so there's nothing to
 * restore afterward beyond deleting the project itself.
 */
test.describe('project members (administrator)', () => {
  test('add, update roles for, and remove a team member', async ({ page }) => {
    const name = `Playwright Members ${Date.now().toString(36)}`;

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

    const createProjectDialog = page.getByRole('dialog');
    await createProjectDialog.getByLabel('Name').fill(name);
    const [createProjectResponse] = await Promise.all([
      waitForOperation(page, 'CreateProject'),
      createProjectDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const projectId = (await createProjectResponse.json())?.data?.createProject
      ?.project?.id;
    expect(projectId, 'failed to create the throwaway project').toBeTruthy();

    await page.goto(`/projects/${projectId}/members`);
    await expect(
      page.getByRole('heading', { name: 'Team Members', level: 2 })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Add Team Member' }).click();
    const addDialog = page.getByRole('dialog');
    await expect(addDialog.getByText('Add Team Member')).toBeVisible();
    // Just "Intern", not "Playwright Intern" — confirmed live that this
    // lookup's search matches first/last name as separate fields, not the
    // concatenated display name, so the two-word query finds nothing at
    // all (a real, minor search-parity quirk, incidental to this test).
    await addDialog.getByLabel('Person').fill('Intern');
    // exact — a non-exact substring match also catches the lookup's own
    // "Create 'Intern'" fallback option (which echoes the typed search
    // text), especially before the debounced search response lands.
    const personOption = page.getByRole('option', {
      name: 'Playwright Intern',
      exact: true,
    });
    await expect(personOption).toBeVisible();
    await personOption.click();

    const [createMemberResponse] = await Promise.all([
      waitForOperation(page, 'CreateProjectMember'),
      addDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createMemberBody = await createMemberResponse.json();
    expect(
      createMemberBody?.data?.createProjectMember?.projectMember?.id,
      `failed to add the team member: ${JSON.stringify(createMemberBody)}`
    ).toBeTruthy();
    await expect(addDialog).not.toBeVisible();

    const editButton = page.getByRole('button', { name: 'Edit' }).first();
    await expect(editButton).toBeVisible();

    const [getRolesResponse] = await Promise.all([
      waitForOperation(page, 'GetUserRoles'),
      editButton.click(),
    ]);
    expect(
      (await getRolesResponse.json())?.errors,
      'GetUserRoles should not error when the Update Team Member dialog opens'
    ).toBeFalsy();

    const updateDialog = page.getByRole('dialog');
    await expect(updateDialog.getByText('Update Team Member')).toBeVisible();
    await updateDialog.getByLabel('Roles').click();
    const roleOption = page
      .locator('[role="option"]:not([aria-disabled="true"])')
      .first();
    await expect(roleOption).toBeVisible();
    await roleOption.click();
    await page.keyboard.press('Escape');

    const [updateMemberResponse] = await Promise.all([
      waitForOperation(page, 'UpdateProjectMember'),
      updateDialog.getByRole('button', { name: 'Save' }).click(),
    ]);
    expect(
      (await updateMemberResponse.json())?.errors,
      'expected the role update to succeed'
    ).toBeFalsy();
    await expect(updateDialog).not.toBeVisible();

    await editButton.click();
    await expect(updateDialog.getByText('Update Team Member')).toBeVisible();
    const [deleteMemberResponse] = await Promise.all([
      waitForOperation(page, 'DeleteProjectMember'),
      updateDialog.getByRole('button', { name: 'Delete' }).click(),
    ]);
    expect(
      (await deleteMemberResponse.json())?.errors,
      'expected removing the team member to succeed'
    ).toBeFalsy();

    // Cleanup: delete the throwaway project via the API (already proven
    // safe/real in project-lifecycle.spec.ts, no need to re-drive the UI
    // delete flow here too).
    await page.request.post(`${API_BASE}/graphql/PlaywrightDeleteProject`, {
      data: {
        operationName: 'PlaywrightDeleteProject',
        query:
          'mutation PlaywrightDeleteProject($id: ID!) { deleteProject(id: $id) { __typename } }',
        variables: { id: projectId },
      },
    });
  });
});
