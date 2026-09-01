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
 * Round 11 (depth): server-side validation errors surfaced through real
 * forms. The coverage push proved operations *fire* against Postgres; this
 * proves they *fail the same way*. Duplicate project name is the anchor
 * case because both backends throw the identical contract by design —
 * `DuplicateException('name', 'Project with this name already exists')` in
 * cord-api-v3's `project.repository.ts` (Neo4j, via the ProjectName
 * uniqueness constraint) and `project.drizzle.repository.ts` (Postgres, via
 * the `projects_name_active_unique` index). Client-side, the default
 * `Duplicate` handler in `form-error-handling.ts` maps it onto the dialog's
 * `name` field as the literal text "Already in use" (it does NOT render the
 * server message), keeping the dialog open.
 *
 * Written in Round 11 while the local API was pointed at the cutover DB
 * (personas unseeded) — verified against both repos' source; first live run
 * still pending.
 */
test.describe('server error paths (administrator)', () => {
  test('creating a project with a duplicate name shows a field error and keeps the dialog open', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const name = `Playwright Duplicate ${suffix}`;

    const existingResp = await gql(
      page,
      `mutation { createProject(input:{name:"${name}", type:MomentumTranslation}) { project { id } } }`
    );
    const existingId = existingResp?.data?.createProject?.project?.id;
    expect(
      existingId,
      `failed to create the pre-existing project: ${JSON.stringify(
        existingResp
      )}`
    ).toBeTruthy();

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
    await expect(dialog.getByText('Create Project')).toBeVisible();
    await dialog.getByLabel('Name', { exact: true }).fill(name);

    const [createResponse] = await Promise.all([
      waitForOperation(page, 'CreateProject'),
      dialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const body = await createResponse.json();
    expect(
      body?.errors?.[0]?.message,
      'expected the server to reject the duplicate name'
    ).toBe('Project with this name already exists');

    // The Duplicate handler maps the error onto the `name` field as
    // "Already in use" and the dialog stays open — no project created,
    // no success snackbar.
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Already in use')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    await gql(
      page,
      `mutation { deleteProject(id: "${existingId}") { __typename } }`
    );
  });
});
