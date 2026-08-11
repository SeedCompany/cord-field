import { expect, test } from '../../support/test';

/**
 * Round 3 of the comprehensive-coverage push: a throwaway Project's full
 * create → transition → delete lifecycle, all via real UI actions
 * (CreateProject/DeleteProject both have real buttons — confirmed via
 * research before writing this, unlike several other domains this session
 * where no UI delete path exists at all).
 */
test.describe('project lifecycle (administrator)', () => {
  test('create, transition, view history, and delete a project', async ({
    page,
  }) => {
    const name = `Playwright Lifecycle ${Date.now().toString(36)}`;

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

    const createDialog = page.getByRole('dialog');
    await expect(createDialog.getByText('Create Project')).toBeVisible();
    await createDialog.getByLabel('Name').fill(name);

    const [createResponse] = await Promise.all([
      page.waitForResponse(async (res) => {
        if (!res.url().includes('/graphql/CreateProject')) return false;
        const body = await res.json().catch(() => null);
        return !(
          body?.errors?.length === 1 &&
          body.errors[0]?.message === 'PersistedQueryNotFound'
        );
      }),
      createDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createBody = await createResponse.json();
    const projectId = createBody?.data?.createProject?.project?.id;
    expect(
      projectId,
      `failed to create the throwaway project: ${JSON.stringify(createBody)}`
    ).toBeTruthy();
    await expect(createDialog).not.toBeVisible();

    await page.goto(`/projects/${projectId}`);
    await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();

    // Not `{name: 'Status'}` — that substring-matches both this button and
    // the unrelated "View Status History Log" icon button.
    const statusButton = page.getByRole('button', { name: /^Status\s/u });
    const beforeStepText = await statusButton.textContent();
    await statusButton.click();

    const workflowDialog = page.getByRole('dialog');
    await expect(workflowDialog.getByText('Update Project')).toBeVisible();

    const overrideField = workflowDialog.getByLabel('Override Step');
    if (await overrideField.isVisible().catch(() => false)) {
      // Administrator can bypass transitions directly to any step — more
      // deterministic than guessing which of the normal transition buttons
      // (if any exist yet for a freshly-created project) is enabled.
      await overrideField.click();
      const options = page.getByRole('option');
      await expect(options.first()).toBeVisible();
      const allOptions = await options.all();
      let picked = false;
      for (const option of allOptions) {
        const optionText = await option.textContent();
        if (optionText && !beforeStepText?.includes(optionText)) {
          await option.click();
          picked = true;
          break;
        }
      }
      expect(
        picked,
        'no override step option differed from the current one'
      ).toBe(true);
    } else {
      // No bypass rights — fall back to whichever real transition is
      // enabled, same pattern as fieldpartner/workflow-history.spec.ts.
      const enabledTransition = workflowDialog
        .locator('button:not([disabled])')
        .filter({ hasText: /.+/u })
        .first();
      await expect(enabledTransition).toBeVisible();
      await enabledTransition.click();
    }

    const [transitionResponse] = await Promise.all([
      page.waitForResponse(async (res) => {
        if (!res.url().includes('/graphql/TransitionProject')) return false;
        const body = await res.json().catch(() => null);
        return !(
          body?.errors?.length === 1 &&
          body.errors[0]?.message === 'PersistedQueryNotFound'
        );
      }),
      // exact — the dialog also lists real per-transition buttons like
      // "Submit for Concept Approval" that substring-match "Submit".
      workflowDialog
        .getByRole('button', { name: 'Submit', exact: true })
        .click(),
    ]);
    const transitionBody = await transitionResponse.json();
    expect(
      transitionBody?.errors,
      `expected the transition to succeed: ${JSON.stringify(transitionBody)}`
    ).toBeFalsy();
    await expect(workflowDialog).not.toBeVisible();

    await page.getByRole('button', { name: 'View Status History Log' }).click();
    const historyDrawer = page.getByRole('presentation').filter({
      hasText: 'Status History',
    });
    await expect(historyDrawer.getByText('Status History')).toBeVisible();
    await page.keyboard.press('Escape');

    const deleteButton = page.getByRole('button', { name: 'Delete Project' });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const deleteDialog = page.getByRole('dialog');
    await expect(deleteDialog.getByText('Delete Project')).toBeVisible();
    await deleteDialog.getByRole('button', { name: 'Delete' }).click();

    await page.waitForURL('/');
  });
});
