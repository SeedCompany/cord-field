import { Page } from '@playwright/test';
import { findSeededPartnerId } from '../../support/fixtures';
import { gql, waitForOperation } from '../../support/graphql';
import { expect, test } from '../../support/test';

// This app's `TabList` collapses into a `TextField select` on mobile
// viewports instead of rendering `role="tab"` elements (established in
// Round 3/8 — applies to FieldRegion/FieldZone detail pages too).
const switchTab = (page: Page, name: string) =>
  page
    .getByRole('combobox')
    .click()
    .then(() => page.getByRole('option', { name, exact: true }).click());

/**
 * Round 9 (pushing past the "final sweep"): the 10 reference-entity lookup
 * queries and nested-create mutations that Round 8's residual list deferred
 * as "straightforward, reachable... simply not gotten to before time ran
 * out" — `FieldRegionLookup`, `FieldZoneLookup`, `LocationLookup`,
 * `MarketingRegionLookup`, `CompletionDescriptionLookup`,
 * `LanguageOfReportingLookup`, `FieldRegionProjects`, `FieldZoneProjects`,
 * `CreateFieldRegion`, `CreateFieldZone`.
 *
 * These are all plain `useLazyQuery`-backed `LookupField`s (`Autocomplete`
 * with `freeSolo`) nested inside existing Partner/Location/Product forms —
 * typing into the field fires the lookup query directly, no submit needed
 * for the query-only ones. `CreateFieldRegion`/`CreateFieldZone` are the
 * `LookupField`'s own "Create "<name>"" freeSolo option, which opens a
 * NESTED `DialogForm` on top of the current one (confirmed via
 * `LookupField.tsx`'s `renderOption`/`onChange` — `Create "${option}"`).
 */
test.describe('reference-entity lookups (administrator)', () => {
  test('the Partner edit dialogs fire FieldRegionLookup, LocationLookup, and LanguageOfReportingLookup', async ({
    page,
  }) => {
    const partnerId = await findSeededPartnerId(page);

    await page.goto(`/partners/${partnerId}`);
    await expect(page.getByRole('combobox')).toBeVisible();

    // The section's edit `IconButton` only wraps a `<Tooltip title="Edit">`
    // with no `aria-label` of its own, so its accessible name isn't
    // reliably "Edit" — scope to the section (which has exactly one button)
    // instead of matching by name.
    const locationsSection = page.locator('section', {
      hasText: 'Locations',
    });
    await locationsSection.getByRole('button').click();
    let dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const [fieldRegionResponse] = await Promise.all([
      waitForOperation(page, 'FieldRegionLookup'),
      dialog.getByLabel('Field Regions').fill('Seed'),
    ]);
    expect(
      (await fieldRegionResponse.json())?.errors,
      'expected FieldRegionLookup to fire without error'
    ).toBeFalsy();

    const [locationResponse] = await Promise.all([
      waitForOperation(page, 'LocationLookup'),
      dialog.getByLabel('Countries').fill('a'),
    ]);
    expect(
      (await locationResponse.json())?.errors,
      'expected LocationLookup to fire without error'
    ).toBeFalsy();

    // MUI's Autocomplete `stopPropagation`s Escape unconditionally while
    // focus is inside it, so Escape never reaches the Dialog's own
    // close-on-Escape handler here — click the visible Cancel button
    // instead of fighting that.
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).not.toBeVisible();

    const languagesSection = page.locator('section', { hasText: 'Languages' });
    await languagesSection.getByRole('button').click();
    dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const [languageOfReportingResponse] = await Promise.all([
      waitForOperation(page, 'LanguageOfReportingLookup'),
      dialog.getByLabel('Language of Reporting').fill('a'),
    ]);
    expect(
      (await languageOfReportingResponse.json())?.errors,
      'expected LanguageOfReportingLookup to fire without error'
    ).toBeFalsy();

    await dialog.getByRole('button', { name: 'Cancel' }).click();
  });

  test("a throwaway Location's edit dialog fires MarketingRegionLookup", async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const createResp = await gql(
      page,
      `mutation { createLocation(input:{name:"Playwright MRL Location ${suffix}", isoAlpha3:"TUV", type:Country}) { location { id } } }`
    );
    const locationId = createResp?.data?.createLocation?.location?.id;
    expect(locationId, 'failed to create the throwaway location').toBeTruthy();

    await page.goto(`/locations/${locationId}`);
    await page.getByRole('button', { name: 'edit location' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const [marketingRegionResponse] = await Promise.all([
      waitForOperation(page, 'MarketingRegionLookup'),
      dialog.getByLabel('Marketing Region').fill('a'),
    ]);
    expect(
      (await marketingRegionResponse.json())?.errors,
      'expected MarketingRegionLookup to fire without error'
    ).toBeFalsy();

    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await gql(
      page,
      `mutation { deleteLocation(id: "${locationId}") { __typename } }`
    );
  });

  test('the seeded FieldRegion and FieldZone Projects tabs load', async ({
    page,
  }) => {
    const lookupRes = await gql(
      page,
      'query { fieldRegions(input:{filter:{name:"Playwright Seed Field Region"}}) { items { id } } fieldZones(input:{filter:{name:"Playwright Seed Field Zone"}}) { items { id } } }'
    );
    let fieldRegionId = lookupRes?.data?.fieldRegions?.items?.[0]?.id;
    let fieldZoneId = lookupRes?.data?.fieldZones?.items?.[0]?.id;
    if (!fieldRegionId || !fieldZoneId) {
      // Round 8's edit test renames the seeded fixtures with a timestamp
      // suffix each run (`Playwright Seed Field Region ${suffix}`) — a
      // filtered lookup by the exact seed name can miss after that. Fall
      // back to "first of whatever exists" like the earlier round's test.
      const fallback = await gql(
        page,
        'query { fieldRegions { items { id } } fieldZones { items { id } } }'
      );
      fieldRegionId =
        fieldRegionId ?? fallback?.data?.fieldRegions?.items?.[0]?.id;
      fieldZoneId = fieldZoneId ?? fallback?.data?.fieldZones?.items?.[0]?.id;
    }
    expect(fieldRegionId, 'expected a field region to exist').toBeTruthy();
    expect(fieldZoneId, 'expected a field zone to exist').toBeTruthy();

    await page.goto(`/field-regions/${fieldRegionId}`);
    await expect(page.getByRole('combobox')).toBeVisible();
    const [fieldRegionProjectsResponse] = await Promise.all([
      waitForOperation(page, 'FieldRegionProjects'),
      switchTab(page, 'Projects'),
    ]);
    expect(
      (await fieldRegionProjectsResponse.json())?.errors,
      'expected the FieldRegion Projects tab to load without error'
    ).toBeFalsy();

    await page.goto(`/field-zones/${fieldZoneId}`);
    await expect(page.getByRole('combobox')).toBeVisible();
    const [fieldZoneProjectsResponse] = await Promise.all([
      waitForOperation(page, 'FieldZoneProjects'),
      switchTab(page, 'Projects'),
    ]);
    expect(
      (await fieldZoneProjectsResponse.json())?.errors,
      'expected the FieldZone Projects tab to load without error'
    ).toBeFalsy();
  });

  /**
   * `CreateFieldRegion` via the nested "Create" freeSolo option on a
   * throwaway Location's "Default Field Region" field, referencing the
   * EXISTING seeded Field Zone (so this stays a 2-dialog-deep interaction —
   * Location edit dialog + Field Region create dialog. A 3-deep version
   * (Location → Region create → Zone create, all nested) was tried first
   * and reliably hung on the Region dialog's own Submit after the Zone
   * dialog closed: dialog count correctly dropped to 1, the Director field
   * visibly held the right value right after selecting it, yet the
   * `CreateFieldRegion` request never fired and the fields silently reset a
   * moment later. That smells like MUI's stacked `FocusTrap`/modal-manager
   * misbehaving three Dialogs deep, not anything wrong with the mutation
   * itself — `CreateFieldZone` is exercised separately below via a
   * shallower 2-deep nesting instead of chasing that further.
   */
  test('creating a new Field Region referencing the existing seeded Field Zone', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const directorLookup = await gql(
      page,
      'query { fieldRegions { items { director { value { id fullName realLastName { value } } } } } }'
    );
    interface DirectorValue {
      id: string;
      fullName: string;
      realLastName: { value: string };
    }
    const regionDirector = directorLookup?.data?.fieldRegions?.items?.find(
      (r: { director: { value: DirectorValue | null } }) => r.director.value
    )?.director.value;
    expect(
      regionDirector?.id,
      'expected an existing FieldRegion director to reuse'
    ).toBeTruthy();

    const createResp = await gql(
      page,
      `mutation { createLocation(input:{name:"Playwright CFR Location ${suffix}", isoAlpha3:"TUV", type:Country}) { location { id } } }`
    );
    const locationId = createResp?.data?.createLocation?.location?.id;
    expect(locationId, 'failed to create the throwaway location').toBeTruthy();

    await page.goto(`/locations/${locationId}`);
    await page.getByRole('button', { name: 'edit location' }).click();
    const locationDialog = page.getByRole('dialog');
    await expect(locationDialog).toBeVisible();

    const regionName = `Playwright New FR ${suffix}`;
    await locationDialog.getByLabel('Default Field Region').fill(regionName);
    const createRegionOption = page
      .getByRole('option')
      .filter({ hasText: `Create "${regionName}"` });
    await expect(createRegionOption).toBeVisible();
    await createRegionOption.click();

    const regionDialog = page.getByRole('dialog').last();
    await expect(
      regionDialog.getByRole('heading', { name: 'Create Field Region' })
    ).toBeVisible();
    await expect(regionDialog.getByLabel('Field Region Name')).toHaveValue(
      regionName
    );

    await regionDialog.getByLabel('Field Zone').fill('Seed');
    const zoneOption = page
      .getByRole('option')
      .filter({ hasText: 'Playwright Seed Field Zone' })
      .first();
    await expect(zoneOption).toBeVisible();
    await zoneOption.click();

    // Search by last name, not the concatenated full name — `UserLookup`
    // has a known pre-existing quirk where a "First Last" query matches
    // nothing (documented in HANDOFF.md's residual list).
    await regionDialog
      .getByLabel('Director')
      .fill(regionDirector.realLastName.value);
    const regionDirectorOption = page.getByRole('option', {
      name: regionDirector.fullName,
      exact: true,
    });
    await expect(regionDirectorOption).toBeVisible();
    await regionDirectorOption.click();

    const [createRegionResponse] = await Promise.all([
      waitForOperation(page, 'CreateFieldRegion'),
      regionDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createRegionBody = await createRegionResponse.json();
    const newRegionId =
      createRegionBody?.data?.createFieldRegion?.fieldRegion?.id;
    expect(
      newRegionId,
      `failed to create the field region: ${JSON.stringify(createRegionBody)}`
    ).toBeTruthy();

    await gql(
      page,
      `mutation { deleteFieldRegion(id: "${newRegionId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deleteLocation(id: "${locationId}") { __typename } }`
    );
  });

  /**
   * `CreateFieldZone` + `FieldZoneLookup` via a throwaway FieldRegion's OWN
   * edit dialog (2-dialog-deep: FieldRegion edit + Field Zone create) —
   * see the comment above for why this isn't nested a 3rd level inside a
   * Location dialog too.
   */
  test("creating a new Field Zone from a throwaway FieldRegion's edit dialog", async ({
    page,
    cleanup,
  }) => {
    const suffix = Date.now().toString(36);
    // `name` filters are exact-match, and Round 8's edit test renames the
    // seeded fixture with a timestamp suffix each run
    // (`Playwright Seed Field Zone ${suffix}`) — fetch all and match by
    // prefix instead, falling back to "whatever exists first" like the
    // earlier Projects-tab test in this file.
    const seedLookup = await gql(
      page,
      'query { fieldZones { items { id name { value } director { value { id fullName realLastName { value } roles { value } } } } } }'
    );
    interface DirectorValue {
      id: string;
      fullName: string;
      realLastName: { value: string };
      roles: { value: string[] };
    }
    interface ZoneItem {
      id: string;
      name: { value: string };
      director: { value: DirectorValue | null };
    }
    const zones: ZoneItem[] = seedLookup?.data?.fieldZones?.items ?? [];
    const existingZoneId = (
      zones.find((z) =>
        z.name.value.startsWith('Playwright Seed Field Zone')
      ) ?? zones[0]
    )?.id;
    // This test creates a FieldRegion *and* a FieldZone, and the API validates
    // a different role for each: createFieldRegion demands RegionalDirector,
    // createFieldZone demands FieldOperationsDirector (field-zone.service.ts /
    // field-region.service.ts). Borrowing a FieldRegion's director covered
    // only the first and made the zone create fail with "User does not have
    // the Field Operations Director role" — so require both roles up front.
    const director = zones
      .map((z) => z.director.value)
      .find(
        (d) =>
          d?.roles.value.includes('RegionalDirector') &&
          d.roles.value.includes('FieldOperationsDirector')
      );
    expect(
      existingZoneId,
      'expected the seeded field zone to exist'
    ).toBeTruthy();
    expect(
      director?.id,
      'expected a director holding both RegionalDirector and FieldOperationsDirector'
    ).toBeTruthy();
    // Narrowed once here rather than asserting at each of the three use sites.
    const seedDirector = director!;

    const createResp = await gql(
      page,
      `mutation { createFieldRegion(input:{name:"Playwright CFZ Region ${suffix}", fieldZone:"${existingZoneId}", director:"${seedDirector.id}"}) { fieldRegion { id } } }`
    );
    const regionId = createResp?.data?.createFieldRegion?.fieldRegion?.id;
    cleanup.add('throwaway field region', () =>
      gql(
        page,
        `mutation { deleteFieldRegion(id: "${regionId}") { __typename } }`
      )
    );
    expect(
      regionId,
      `failed to create the throwaway field region: ${JSON.stringify(
        createResp
      )}`
    ).toBeTruthy();

    await page.goto(`/field-regions/${regionId}`);
    await page.getByRole('button', { name: 'edit region' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const zoneName = `Playwright New FZ ${suffix}`;
    const [fieldZoneLookupResponse] = await Promise.all([
      waitForOperation(page, 'FieldZoneLookup'),
      dialog.getByLabel('Field Zone').fill(zoneName),
    ]);
    expect(
      (await fieldZoneLookupResponse.json())?.errors,
      'expected FieldZoneLookup to fire without error'
    ).toBeFalsy();

    const createZoneOption = page
      .getByRole('option')
      .filter({ hasText: `Create "${zoneName}"` });
    await expect(createZoneOption).toBeVisible();
    await createZoneOption.click();

    const zoneDialog = page.getByRole('dialog').last();
    await expect(zoneDialog.getByLabel('Field Zone Name')).toHaveValue(
      zoneName
    );
    await zoneDialog
      .getByLabel('Director')
      .fill(seedDirector.realLastName.value);
    const zoneDirectorOption = page.getByRole('option', {
      name: seedDirector.fullName,
      exact: true,
    });
    await expect(zoneDirectorOption).toBeVisible();
    await zoneDirectorOption.click();

    const [createZoneResponse] = await Promise.all([
      waitForOperation(page, 'CreateFieldZone'),
      zoneDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const createZoneBody = await createZoneResponse.json();
    const newZoneId = createZoneBody?.data?.createFieldZone?.fieldZone?.id;
    cleanup.add('throwaway field zone', () =>
      gql(
        page,
        `mutation { deleteFieldZone(id: "${newZoneId}") { __typename } }`
      )
    );
    expect(
      newZoneId,
      `failed to create the field zone: ${JSON.stringify(createZoneBody)}`
    ).toBeTruthy();

    // The outer FieldRegion edit dialog reopened its own Field Zone field
    // now pointed at the brand new zone — cancel rather than submit, since
    // this test only needs `CreateFieldZone` covered, not another
    // `UpdateFieldRegion` (already covered elsewhere).
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await dialog.getByRole('button', { name: 'Cancel' }).click();
  });

  test('CompletionDescriptionLookup fires when a new Product has its methodology set', async ({
    page,
  }) => {
    const engagementLookup = await gql(
      page,
      'query { projects(input:{filter:{name:"Playwright Seed Project"},count:1}) { items { id } } }'
    );
    const projectId = engagementLookup?.data?.projects?.items?.[0]?.id;
    expect(
      projectId,
      'expected the seeded fixture project to exist'
    ).toBeTruthy();

    const engagementResp = await gql(
      page,
      `query { project(id: "${projectId}") { engagements { items { id __typename } } } }`
    );
    const engagement = engagementResp?.data?.project?.engagements?.items?.find(
      (e: { __typename: string }) => e.__typename === 'LanguageEngagement'
    );
    expect(
      engagement?.id,
      'expected the seeded project to have a LanguageEngagement'
    ).toBeTruthy();

    await page.goto(`/engagements/${engagement.id}/products/create`);
    await expect(page.getByText('Create Goal')).toBeVisible();

    await page.getByText('Methodology').click();
    await page.getByRole('radio', { name: 'Paratext' }).click();

    await page.getByText('Completion Description').click();
    const [completionLookupResponse] = await Promise.all([
      waitForOperation(page, 'CompletionDescriptionLookup'),
      page.getByLabel('Completion means...').fill('Playwright test'),
    ]);
    expect(
      (await completionLookupResponse.json())?.errors,
      'expected CompletionDescriptionLookup to fire without error'
    ).toBeFalsy();

    // Not submitted — this test only needs the lookup query to fire, and
    // CreateProduct/CreateDirectScriptureProduct already have their own
    // coverage from Round 7's Products CRUD sweep. Navigate away instead of
    // leaving a half-filled create form (no throwaway data was persisted).
    await page.goto(`/engagements/${engagement.id}`);
  });
});
