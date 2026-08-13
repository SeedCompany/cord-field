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

const openCreateMenu = async (page: Page, itemLabel: string) => {
  await page.goto('/projects');
  const createItemButton = page.getByRole('button', {
    name: 'Create New Item',
  });
  if (!(await createItemButton.isVisible())) {
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    await expect(createItemButton).toBeVisible();
  }
  await createItemButton.click();
  await page.getByRole('menuitem', { name: itemLabel, exact: true }).click();
};

/**
 * Round 8 (final sweep) of the comprehensive-coverage push: a grab-bag of
 * small, self-contained CRUD flows that don't fit any earlier round's
 * domain — each creates/edits/deletes only its own throwaway data.
 */
test.describe('entity CRUD misc (administrator)', () => {
  test('createLanguage via the sidebar Create New Item menu', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    await openCreateMenu(page, 'Language');

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Create Language')).toBeVisible();
    await dialog
      .getByLabel('Name', { exact: true })
      .fill(`playwright-lang-${suffix}`);
    await dialog
      .getByLabel('Public Name', { exact: true })
      .fill(`playwright-lang-${suffix}`);
    const [createResponse] = await Promise.all([
      waitForOperation(page, 'createLanguage'),
      dialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createBody = await createResponse.json();
    const languageId = createBody?.data?.createLanguage?.language?.id;
    expect(
      languageId,
      `failed to create the language: ${JSON.stringify(createBody)}`
    ).toBeTruthy();

    await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query: `mutation { deleteLanguage(id: "${languageId}") { __typename } }`,
      },
    });
  });

  test('create, edit, and delete a Tool', async ({ page }) => {
    const suffix = Date.now().toString(36);
    await openCreateMenu(page, 'Tool');

    const createDialog = page.getByRole('dialog');
    await expect(createDialog.getByText('Create Tool')).toBeVisible();
    await createDialog
      .getByLabel('Tool Name')
      .fill(`Playwright Tool ${suffix}`);
    const [createResponse] = await Promise.all([
      waitForOperation(page, 'CreateTool'),
      createDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createBody = await createResponse.json();
    const toolId = createBody?.data?.createTool?.tool?.id;
    expect(
      toolId,
      `failed to create the tool: ${JSON.stringify(createBody)}`
    ).toBeTruthy();
    await expect(createDialog).not.toBeVisible();

    await page.goto(`/tools/${toolId}`);
    await page.getByRole('button', { name: 'edit tool' }).click();
    const editDialog = page.getByRole('dialog');
    await expect(editDialog.getByText('Edit Tool')).toBeVisible();
    await editDialog.getByLabel('Description').fill('Playwright edit check');
    const [editResponse] = await Promise.all([
      waitForOperation(page, 'EditTool'),
      editDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(
      (await editResponse.json())?.errors,
      'expected editing the tool to succeed'
    ).toBeFalsy();

    await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query: `mutation { deleteTool(id: "${toolId}") { __typename } }`,
      },
    });
  });

  test('edit the seeded FieldRegion and FieldZone', async ({ page }) => {
    const suffix = Date.now().toString(36);
    const lookupRes = await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query:
          'query { fieldRegions { items { id } } fieldZones { items { id } } }',
      },
    });
    const lookupBody = await lookupRes.json();
    const fieldRegionId = lookupBody?.data?.fieldRegions?.items?.[0]?.id;
    const fieldZoneId = lookupBody?.data?.fieldZones?.items?.[0]?.id;
    expect(
      fieldRegionId,
      'expected the seeded fixture field region to exist'
    ).toBeTruthy();
    expect(
      fieldZoneId,
      'expected the seeded fixture field zone to exist'
    ).toBeTruthy();

    await page.goto(`/field-regions/${fieldRegionId}`);
    await page.getByRole('button', { name: 'edit region' }).click();
    const regionDialog = page.getByRole('dialog');
    await expect(regionDialog.getByText('Edit Field Region')).toBeVisible();
    await regionDialog
      .getByLabel('Field Region Name')
      .fill(`Playwright Seed Field Region ${suffix}`);
    const [regionResponse] = await Promise.all([
      waitForOperation(page, 'UpdateFieldRegion'),
      regionDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(
      (await regionResponse.json())?.errors,
      'expected editing the field region to succeed'
    ).toBeFalsy();

    await page.goto(`/field-zones/${fieldZoneId}`);
    await page.getByRole('button', { name: 'edit zone' }).click();
    const zoneDialog = page.getByRole('dialog');
    await expect(zoneDialog.getByText('Edit Field Zone')).toBeVisible();
    await zoneDialog
      .getByLabel('Field Zone Name')
      .fill(`Playwright Seed Field Zone ${suffix}`);
    const [zoneResponse] = await Promise.all([
      waitForOperation(page, 'UpdateFieldZone'),
      zoneDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(
      (await zoneResponse.json())?.errors,
      'expected editing the field zone to succeed'
    ).toBeFalsy();
  });

  test('create and edit a throwaway Location', async ({ page }) => {
    const suffix = Date.now().toString(36);
    await openCreateMenu(page, 'Location');

    const createDialog = page.getByRole('dialog');
    await expect(createDialog.getByText('Create Location')).toBeVisible();
    await createDialog
      .getByLabel('Location Name')
      .fill(`Playwright Location ${suffix}`);
    await createDialog.getByLabel('ISO Alpha-3 Country Code').fill('TUV');
    const [createResponse] = await Promise.all([
      waitForOperation(page, 'CreateLocation'),
      createDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createBody = await createResponse.json();
    const locationId = createBody?.data?.createLocation?.location?.id;
    expect(
      locationId,
      `failed to create the location: ${JSON.stringify(createBody)}`
    ).toBeTruthy();
    await expect(createDialog).not.toBeVisible();

    await page.goto(`/locations/${locationId}`);
    await page.getByRole('button', { name: 'edit location' }).click();
    const editDialog = page.getByRole('dialog');
    await expect(editDialog.getByText('Edit Location')).toBeVisible();
    await editDialog
      .getByLabel('Location Name')
      .fill(`Playwright Location ${suffix} (edited)`);
    const [editResponse] = await Promise.all([
      waitForOperation(page, 'UpdateLocation'),
      editDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(
      (await editResponse.json())?.errors,
      'expected editing the location to succeed'
    ).toBeFalsy();

    await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query: `mutation { deleteLocation(id: "${locationId}") { __typename } }`,
      },
    });
  });

  test('createPerson via the sidebar Create New Item menu', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    await openCreateMenu(page, 'Person');

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Create Person')).toBeVisible();
    await dialog.getByLabel('First Name', { exact: true }).fill('Playwright');
    await dialog
      .getByLabel('Last Name', { exact: true })
      .fill(`Person ${suffix}`);
    await dialog
      .getByLabel('Public First Name', { exact: true })
      .fill('Playwright');
    await dialog
      .getByLabel('Public Last Name', { exact: true })
      .fill(`Person ${suffix}`);
    const [createResponse] = await Promise.all([
      waitForOperation(page, 'CreatePerson'),
      dialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createBody = await createResponse.json();
    const userId = createBody?.data?.createPerson?.user?.id;
    expect(
      userId,
      `failed to create the person: ${JSON.stringify(createBody)}`
    ).toBeTruthy();

    await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query: `mutation { deleteUser(id: "${userId}") { __typename } }`,
      },
    });
  });

  /**
   * `UpdateProject` turned out to have zero real UI-driven coverage anywhere
   * in this suite, despite being a heavily-used mutation — every prior round
   * that needed to change a project's field (setting `primaryLocation`/
   * `mouStart`/`mouEnd` to reach `Active` status, for example) did it via a
   * direct API call as setup for a DIFFERENT operation under test, which the
   * coverage tracker can't see (`page.request` doesn't fire
   * `page.on('response')` — the same pre-existing gap documented back in the
   * Tools/FieldRegions round). This closes that gap with a real UI action.
   */
  test("edit the seeded project's Field Region via ProjectOverview", async ({
    page,
  }) => {
    const lookupRes = await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query:
          'query { projects(input:{filter:{name:"Playwright Seed Project"},count:1}) { items { id fieldRegion { value { id } } } } }',
      },
    });
    const project = (await lookupRes.json())?.data?.projects?.items?.[0];
    expect(
      project?.id,
      'expected the seeded fixture project to exist'
    ).toBeTruthy();
    // Not assumed empty — a prior run of this same test may have already
    // set it, and re-selecting an unchanged value isn't a dirty field, so
    // `Save` would silently no-op. Toggle instead: clear it if already set,
    // set it if empty — either direction is a genuine `UpdateProject` call.
    const alreadySet = Boolean(project?.fieldRegion?.value?.id);

    await page.goto(`/projects/${project.id}`);
    // A `DataButton` showing the current value substring-matches any other
    // button whose name also starts with the same label — anchor with a
    // regex rather than a bare substring (established in Round 3).
    await page.getByRole('button', { name: /^Field Region/u }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Update Project')).toBeVisible();
    const fieldRegionField = dialog.getByLabel('Field Region');
    if (alreadySet) {
      await fieldRegionField.fill('');
      await page.keyboard.press('Escape');
    } else {
      await fieldRegionField.fill('Playwright Seed');
      const fieldRegionOption = page
        .getByRole('option')
        .filter({ hasText: 'Playwright Seed Field Region' })
        .first();
      await expect(fieldRegionOption).toBeVisible();
      await fieldRegionOption.click();
    }
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateProject'),
      dialog.getByRole('button', { name: 'Save' }).click(),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected editing the project field region to succeed'
    ).toBeFalsy();
  });
});
