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

// `createAddItemFooter`'s button is wrapped in a plain `<span>` (needed so
// MUI's Tooltip still works when the button is disabled) — the Tooltip's
// `aria-label` lands on that wrapping `<span>`, not the `<button>` itself,
// so the button's own accessible name is empty. The footer also isn't
// inside MUI DataGrid's built-in `.MuiDataGrid-footerContainer` (confirmed
// via a real DOM dump) — it's a plain `Stack`. Target the labeled span
// directly instead of guessing a footer container class or button name.
const addFooterButton = (page: Page, tooltipLabel: string) =>
  page.locator(`[aria-label="${tooltipLabel}"]`);

/**
 * Round 9: `AddLocationToLanguage`/`RemoveLocationFromLanguage`,
 * `AssignPersonToPartner`/`RemovePersonFromPartner`, and
 * `AssignOrganizationToUser`/`RemoveOrganizationFromUser` — the 6 ops Round
 * 8 declared "permanently unreachable" because every persona in this suite
 * runs at a 500×900 mobile viewport, and `LanguageDetailLocations.tsx`/
 * `PartnerDetailPeople.tsx`/`UserPartnersPanel.tsx` only render the
 * add/remove `DataGridPro` UI on the DESKTOP branch of a plain
 * `useIsMobile()` check — the mobile branch renders a read-only `EntityList`
 * instead. That's a viewport constraint, not a hard wall: `useIsMobile`
 * (`common/useIsMobile.ts`) is `useMediaQuery(theme.breakpoints.down('md'))`,
 * fully honored by Chromium under Playwright — overriding this file's
 * viewport to desktop size (below) while reusing the same persona
 * `storageState` makes all 6 ops reachable with no app changes.
 *
 * Each test creates its own throwaway pair (the container + the thing being
 * added), adds it via the real grid footer button, then removes it via the
 * real per-row delete icon — covering both directions of each pair in one
 * pass — before cleaning up via direct API calls.
 *
 * `AddLocationToLanguage`/`RemoveLocationFromLanguage` turned out to be a
 * SEPARATE real finding once actually reachable: they fail with a genuine
 * `NotImplementedException` — location-node relationships aren't migrated to
 * Postgres yet (a tracked `migration-todo`, not a permanent block). See that
 * test's own docstring below.
 */
test.describe('desktop-only grid membership (administrator)', () => {
  // Wider than the `md` breakpoint needs (900px) — the User Partners grid's
  // columns (`PartnerColumns`, including the 300px-wide Roles and Financial
  // Reporting Types columns) plus the actions column add up to ~1420px.
  // DataGridPro virtualizes columns horizontally, so at 1280px the
  // off-screen actions column (with the Remove button) never even mounts
  // into the DOM — confirmed by dumping the row's outerHTML and getting a
  // real button count of 0 despite `canCreate` being `true` server-side.
  test.use({ viewport: { width: 1920, height: 1000 } });

  /**
   * `AddLocationToLanguage` is real, UI-reachable at this desktop viewport
   * (the point of this whole file), but calling it fails — confirmed via
   * source, not guessed: `LocationDrizzleRepository.addLocationToNode`/
   * `removeLocationFromNode` (cord-api-v3) both throw `NotImplementedException`
   * unconditionally, each marked `// migration-todo: implement when
   * location-node relationships are migrated to PG`. Unlike the
   * `ProjectChangeRequest` Postgres block (deliberately permanent, changesets
   * are not being carried forward), this one is explicitly a TODO — a
   * temporary migration gap, not a dead end. `RemoveLocationFromLanguage`
   * can't be exercised at all while this holds: there's no way to create the
   * relationship in the first place to then remove.
   *
   * This is a regression tripwire, not a success-path test. If this ever
   * starts passing, that's a signal the migration-todo got done — convert
   * this back into a real add/remove test at that point (the rest of this
   * file's other two tests show the exact shape that should take).
   */
  test('AddLocationToLanguage is UI-reachable but blocked — location-node relationships are not yet migrated to Postgres', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const langResp = await gql(
      page,
      `mutation { createLanguage(input:{name:"Playwright Grid Lang ${suffix}", displayName:"Playwright Grid Lang ${suffix}"}) { language { id } } }`
    );
    const languageId = langResp?.data?.createLanguage?.language?.id;
    expect(languageId, 'failed to create the throwaway language').toBeTruthy();

    const locResp = await gql(
      page,
      `mutation { createLocation(input:{name:"Playwright Grid Loc ${suffix}", isoAlpha3:"TUV", type:Country}) { location { id } } }`
    );
    const locationId = locResp?.data?.createLocation?.location?.id;
    expect(locationId, 'failed to create the throwaway location').toBeTruthy();

    await page.goto(`/languages/${languageId}`);
    await page.getByRole('tab', { name: 'Locations' }).click();
    const addButton = addFooterButton(page, 'Add Location to Language');
    await expect(addButton).toBeVisible();
    await addButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Add Location')).toBeVisible();
    await dialog.getByLabel('Location').fill(suffix);
    const locationOption = page
      .getByRole('option')
      .filter({ hasText: suffix })
      .first();
    await expect(locationOption).toBeVisible();
    await locationOption.click();

    const [addResponse] = await Promise.all([
      waitForOperation(page, 'AddLocationToLanguage'),
      dialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const addBody = await addResponse.json();
    expect(
      addBody?.errors?.[0]?.message,
      `expected the real, temporary Postgres migration-todo block, got: ${JSON.stringify(
        addBody
      )}`
    ).toBe('Not implemented');

    await gql(
      page,
      `mutation { deleteLanguage(id: "${languageId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deleteLocation(id: "${locationId}") { __typename } }`
    );
  });

  test('AssignPersonToPartner / RemovePersonFromPartner via the Partner People grid', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const orgResp = await gql(
      page,
      `mutation { createOrganization(input:{name:"Playwright Grid Org ${suffix}"}) { organization { id } } }`
    );
    const orgId = orgResp?.data?.createOrganization?.organization?.id;
    expect(orgId, 'failed to create the throwaway organization').toBeTruthy();

    const partnerResp = await gql(
      page,
      `mutation { createPartner(input:{organization:"${orgId}"}) { partner { id } } }`
    );
    const partnerId = partnerResp?.data?.createPartner?.partner?.id;
    expect(partnerId, 'failed to create the throwaway partner').toBeTruthy();

    const personResp = await gql(
      page,
      `mutation { createPerson(input:{realFirstName:"Playwright", realLastName:"GridPerson${suffix}", displayFirstName:"Playwright", displayLastName:"GridPerson${suffix}"}) { user { id } } }`
    );
    const userId = personResp?.data?.createPerson?.user?.id;
    expect(userId, 'failed to create the throwaway person').toBeTruthy();

    await page.goto(`/partners/${partnerId}`);
    await page.getByRole('tab', { name: 'People' }).click();
    const addButton = addFooterButton(page, 'Add Person to Partner');
    await expect(addButton).toBeVisible();
    await addButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Add Person to Partner')).toBeVisible();
    // Search by the unique suffix alone, embedded in the last name with no
    // surrounding space — sidesteps `UserLookup`'s known concatenated
    // "First Last" search quirk (documented in HANDOFF.md's residual list).
    await dialog.getByLabel('Person').fill(suffix);
    const personOption = page
      .getByRole('option')
      .filter({ hasText: suffix })
      .first();
    await expect(personOption).toBeVisible();
    await personOption.click();

    const [addResponse] = await Promise.all([
      waitForOperation(page, 'AssignPersonToPartner'),
      dialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(
      (await addResponse.json())?.errors,
      'expected AssignPersonToPartner to succeed'
    ).toBeFalsy();

    const row = page.getByRole('row', { name: new RegExp(suffix, 'u') });
    await expect(row).toBeVisible();
    const [removeResponse] = await Promise.all([
      waitForOperation(page, 'RemovePersonFromPartner'),
      row.getByRole('button').click(),
    ]);
    expect(
      (await removeResponse.json())?.errors,
      'expected RemovePersonFromPartner to succeed'
    ).toBeFalsy();

    await gql(page, `mutation { deleteUser(id: "${userId}") { __typename } }`);
    await gql(
      page,
      `mutation { deletePartner(id: "${partnerId}") { __typename } }`
    );
  });

  test('AssignOrganizationToUser / RemoveOrganizationFromUser via the User Partners grid', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const personResp = await gql(
      page,
      `mutation { createPerson(input:{realFirstName:"Playwright", realLastName:"GridUser${suffix}", displayFirstName:"Playwright", displayLastName:"GridUser${suffix}"}) { user { id } } }`
    );
    const userId = personResp?.data?.createPerson?.user?.id;
    expect(userId, 'failed to create the throwaway user').toBeTruthy();

    const orgResp = await gql(
      page,
      `mutation { createOrganization(input:{name:"Playwright Grid Org2 ${suffix}"}) { organization { id } } }`
    );
    const orgId = orgResp?.data?.createOrganization?.organization?.id;
    expect(orgId, 'failed to create the throwaway organization').toBeTruthy();

    const partnerResp = await gql(
      page,
      `mutation { createPartner(input:{organization:"${orgId}"}) { partner { id } } }`
    );
    const partnerId = partnerResp?.data?.createPartner?.partner?.id;
    expect(partnerId, 'failed to create the throwaway partner').toBeTruthy();

    await page.goto(`/users/${userId}`);
    await page.getByRole('tab', { name: 'Partners' }).click();
    const addButton = addFooterButton(page, 'Add Partner to User');
    await expect(addButton).toBeVisible();
    await addButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Add Partner')).toBeVisible();
    await dialog.getByLabel('Partner').fill(suffix);
    const partnerOption = page
      .getByRole('option')
      .filter({ hasText: suffix })
      .first();
    await expect(partnerOption).toBeVisible();
    await partnerOption.click();

    const [addResponse] = await Promise.all([
      waitForOperation(page, 'AssignOrganizationToUser'),
      dialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(
      (await addResponse.json())?.errors,
      'expected AssignOrganizationToUser to succeed'
    ).toBeFalsy();

    const row = page.getByRole('row', { name: new RegExp(suffix, 'u') });
    await expect(row).toBeVisible();
    const [removeResponse] = await Promise.all([
      waitForOperation(page, 'RemoveOrganizationFromUser'),
      row.getByRole('button').click(),
    ]);
    expect(
      (await removeResponse.json())?.errors,
      'expected RemoveOrganizationFromUser to succeed'
    ).toBeFalsy();

    await gql(page, `mutation { deleteUser(id: "${userId}") { __typename } }`);
    await gql(
      page,
      `mutation { deletePartner(id: "${partnerId}") { __typename } }`
    );
  });

  /**
   * `UpdatePartnerGrid` — same `DataGridPro` cell-edit shape as
   * `UpdateLanguageEngagementGrid` above, but on the global `/partners` list
   * (`PartnerGrid.tsx`), which is sorted server-side by `organization.name`
   * ascending with no client-visible way to jump straight to a specific row
   * without driving the column filter UI. Prefixing the throwaway
   * organization's name with digits sorts it before any real organization
   * name, guaranteeing it lands on the grid's first fetched page.
   */
  test('UpdatePartnerGrid via the Start Date cell on the Partners list', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const orgResp = await gql(
      page,
      `mutation { createOrganization(input:{name:"0000 Playwright Partner Grid ${suffix}"}) { organization { id } } }`
    );
    const orgId = orgResp?.data?.createOrganization?.organization?.id;
    expect(orgId, 'failed to create the throwaway organization').toBeTruthy();

    const partnerResp = await gql(
      page,
      `mutation { createPartner(input:{organization:"${orgId}"}) { partner { id } } }`
    );
    const partnerId = partnerResp?.data?.createPartner?.partner?.id;
    expect(partnerId, 'failed to create the throwaway partner').toBeTruthy();

    await page.goto('/partners');
    // Scope by the full org-name prefix plus suffix, not the bare suffix —
    // `Date.now().toString(36)` is only millisecond-precision, and this
    // file's other tests mint their own suffixes in parallel, so a bare
    // suffix can (rarely) collide with an unrelated row from another test.
    const row = page.getByRole('row', {
      name: new RegExp(`Playwright Partner Grid ${suffix}`, 'u'),
    });
    await expect(row).toBeVisible();

    const dateCell = row.locator('[data-field="startDate"]');
    await dateCell.dblclick();
    // A native `input[type="date"]`, pre-filled with today's date — needs
    // ISO `yyyy-mm-dd`, not a locale-formatted string.
    const dateInput = dateCell.locator('input');
    await expect(dateInput).toBeVisible();
    await dateInput.fill('2025-01-01');
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdatePartnerGrid'),
      page.keyboard.press('Enter'),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected UpdatePartnerGrid to succeed'
    ).toBeFalsy();

    await gql(
      page,
      `mutation { deletePartner(id: "${partnerId}") { __typename } }`
    );
  });
});
