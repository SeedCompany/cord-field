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
 * Round 3 of the comprehensive-coverage push: full create -> edit -> delete
 * lifecycles for both engagement types, each off its own throwaway project
 * (MomentumTranslation defaults to LanguageEngagement; an explicit
 * Internship-type project is needed for InternshipEngagement — see
 * ProjectOverview.tsx's `isTranslation` typename check).
 */
test.describe('engagements (administrator)', () => {
  test('create, edit, and delete a language engagement', async ({ page }) => {
    const projectId = await createThrowawayProject(
      page,
      `Playwright Engagement ${Date.now().toString(36)}`
    );

    await page.goto(`/projects/${projectId}`);
    await page.getByRole('button', { name: 'Add Language Engagement' }).click();

    const createDialog = page.getByRole('dialog');
    await expect(
      createDialog.getByText('Create Language Engagement')
    ).toBeVisible();
    // A real, distinctive seeded language name (fetched live before writing
    // this test) — LanguageField is search-only, no pre-populated options.
    await createDialog.getByLabel('Language').fill('scared-31171d');
    // Not `exact: true` — this option's accessible name also includes its
    // ETH/ROLV code columns (LanguageField's custom `renderOption`).
    const languageOption = page.getByRole('option', {
      name: 'scared-31171d',
    });
    await expect(languageOption).toBeVisible();
    await languageOption.click();

    const [createResponse] = await Promise.all([
      waitForOperation(page, 'createLanguageEngagement'),
      createDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createBody = await createResponse.json();
    const engagementId =
      createBody?.data?.createLanguageEngagement?.engagement?.id;
    expect(
      engagementId,
      `failed to create the language engagement: ${JSON.stringify(createBody)}`
    ).toBeTruthy();
    await expect(createDialog).not.toBeVisible();

    await page.goto(`/engagements/${engagementId}`);
    await page.getByRole('button', { name: 'Enter Paratext ID' }).click();

    const editDialog = page.getByRole('dialog');
    await expect(editDialog.getByText('Update Engagement')).toBeVisible();
    await editDialog.getByLabel('Paratext ID').fill('PLAYWRIGHT-TEST-1');
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateLanguageEngagement'),
      editDialog.getByRole('button', { name: 'Save' }).click(),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected updating the Paratext ID to succeed'
    ).toBeFalsy();

    const deleteButton = page.getByRole('button', {
      name: 'Delete Engagement',
    });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    const deleteDialog = page.getByRole('dialog');
    await expect(deleteDialog.getByText('Delete Engagement')).toBeVisible();
    const [deleteResponse] = await Promise.all([
      waitForOperation(page, 'DeleteEngagement'),
      deleteDialog.getByRole('button', { name: 'Delete' }).click(),
    ]);
    expect(
      (await deleteResponse.json())?.errors,
      'expected deleting the engagement to succeed'
    ).toBeFalsy();

    await deleteThrowawayProject(page, projectId);
  });

  test('create, edit, and delete an internship engagement', async ({
    page,
  }) => {
    const name = `Playwright Internship ${Date.now().toString(36)}`;
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
    await createProjectDialog
      .getByRole('button', { name: 'Internship' })
      .click();
    const [createProjectResponse] = await Promise.all([
      waitForOperation(page, 'CreateProject'),
      createProjectDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const projectId = (await createProjectResponse.json())?.data?.createProject
      ?.project?.id;
    expect(
      projectId,
      'failed to create the throwaway internship project'
    ).toBeTruthy();

    await page.goto(`/projects/${projectId}`);
    await page.getByRole('button', { name: 'Add Intern Engagement' }).click();

    const createDialog = page.getByRole('dialog');
    await expect(
      createDialog.getByText('Create Intern Engagement')
    ).toBeVisible();
    await createDialog.getByLabel('Intern').fill('Intern');
    const internOption = page.getByRole('option', {
      name: 'Playwright Intern',
      exact: true,
    });
    await expect(internOption).toBeVisible();
    await internOption.click();

    const [createResponse] = await Promise.all([
      waitForOperation(page, 'createInternshipEngagement'),
      createDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createBody = await createResponse.json();
    const engagementId =
      createBody?.data?.createInternshipEngagement?.engagement?.id;
    expect(
      engagementId,
      `failed to create the internship engagement: ${JSON.stringify(
        createBody
      )}`
    ).toBeTruthy();
    await expect(createDialog).not.toBeVisible();

    await page.goto(`/engagements/${engagementId}`);
    await page.getByRole('button', { name: 'Enter Web ID' }).click();

    const editDialog = page.getByRole('dialog');
    await expect(editDialog.getByText('Update Engagement')).toBeVisible();
    await editDialog.getByLabel('Web ID').fill('PLAYWRIGHT-TEST-1');
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateInternshipEngagement'),
      editDialog.getByRole('button', { name: 'Save' }).click(),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected updating the Web ID to succeed'
    ).toBeFalsy();

    const deleteButton = page.getByRole('button', {
      name: 'Delete Engagement',
    });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    const deleteDialog = page.getByRole('dialog');
    await expect(deleteDialog.getByText('Delete Engagement')).toBeVisible();
    const [deleteResponse] = await Promise.all([
      waitForOperation(page, 'DeleteEngagement'),
      deleteDialog.getByRole('button', { name: 'Delete' }).click(),
    ]);
    expect(
      (await deleteResponse.json())?.errors,
      'expected deleting the internship engagement to succeed'
    ).toBeFalsy();

    await deleteThrowawayProject(page, projectId);
  });
});
