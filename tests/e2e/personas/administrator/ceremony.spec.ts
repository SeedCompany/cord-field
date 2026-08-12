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
 * Round 6 of the comprehensive-coverage push: `UpdateCeremony`, off a
 * throwaway LanguageEngagement's "Dedication" card. Both engagement types
 * have a ceremony (`Certification` for Internship, `Dedication` for
 * Language — server-assigned by engagement type), but LanguageEngagement's
 * `CeremonyForm` auto-saves on every change (no Save button at all), making
 * it the more direct path to real, repeated mutation coverage.
 */
test.describe('ceremony (administrator)', () => {
  test('toggle planned and set dates auto-saves via UpdateCeremony', async ({
    page,
  }) => {
    const projectId = await createThrowawayProject(
      page,
      `Playwright Ceremony ${Date.now().toString(36)}`
    );

    await page.goto(`/projects/${projectId}`);
    await page.getByRole('button', { name: 'Add Language Engagement' }).click();
    const createDialog = page.getByRole('dialog');
    await createDialog.getByLabel('Language').fill('scared-31171d');
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

    await page.goto(`/engagements/${engagementId}`);
    await expect(page.getByText('Dedication')).toBeVisible();

    // The switch has no direct accessible name of its own (its
    // `FormControlLabel` associates it with the "Dedication" title, itself
    // further wrapped in a second, dynamic-text Tooltip) — targeting the
    // underlying checkbox input by its real `name` attribute sidesteps that
    // ambiguity entirely, same pattern as the file-upload inputs in Round 4.
    const plannedSwitch = page.locator('input[name="planned"]');
    const [plannedResponse] = await Promise.all([
      waitForOperation(page, 'UpdateCeremony'),
      plannedSwitch.click(),
    ]);
    expect(
      (await plannedResponse.json())?.errors,
      'expected marking the dedication as planned to succeed'
    ).toBeFalsy();

    const [plannedDateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateCeremony'),
      page.getByLabel('Planned Date').fill('01/15/2027'),
    ]);
    expect(
      (await plannedDateResponse.json())?.errors,
      'expected setting the planned date to succeed'
    ).toBeFalsy();

    const [actualDateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateCeremony'),
      page.getByLabel('Actual Date').fill('02/20/2027'),
    ]);
    expect(
      (await actualDateResponse.json())?.errors,
      'expected setting the actual date to succeed'
    ).toBeFalsy();

    await page.request.post(`${API_BASE}/graphql/PlaywrightDeleteEngagement`, {
      data: {
        operationName: 'PlaywrightDeleteEngagement',
        query:
          'mutation PlaywrightDeleteEngagement($id: ID!) { deleteEngagement(id: $id) { __typename } }',
        variables: { id: engagementId },
      },
    });
    await deleteThrowawayProject(page, projectId);
  });
});
