import { expect, Page } from '@playwright/test';
import { API_BASE, waitForOperation } from './graphql';

/**
 * Create a project through the real UI and return its id.
 *
 * Specs that need a project to act on use this rather than seeding one over
 * the API, so the create path itself stays covered.
 */
export const createThrowawayProject = async (page: Page, name: string) => {
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

/**
 * Tear a throwaway project down over the API — deliberately not through the
 * UI, so a broken delete dialog can't leak fixtures across runs.
 */
export const deleteThrowawayProject = (page: Page, projectId: string) =>
  page.request.post(`${API_BASE}/graphql/PlaywrightDeleteProject`, {
    data: {
      operationName: 'PlaywrightDeleteProject',
      query:
        'mutation PlaywrightDeleteProject($id: ID!) { deleteProject(id: $id) { __typename } }',
      variables: { id: projectId },
    },
  });
