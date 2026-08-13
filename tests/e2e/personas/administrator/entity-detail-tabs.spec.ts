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

// This app's `TabList` (`components/Tabs/TabList.tsx`) collapses into a
// `TextField select` on mobile viewports instead of rendering `role="tab"`
// elements — established in Round 3's field-regions/tools coverage. Every
// persona in this suite runs at 500×900, below MUI's `md` breakpoint, so
// switching tabs always means opening the combobox and picking an option.
const switchTab = (page: Page, name: string) =>
  page
    .getByRole('combobox')
    .click()
    .then(() => page.getByRole('option', { name, exact: true }).click());

/**
 * Round 8 (final sweep) of the comprehensive-coverage push: detail-page tab
 * queries that fire on simple navigation, no mutation needed — Language's
 * Locations/Projects/Posts tabs, Partner's People/Projects/Engagements/Notes
 * tabs, User's Projects/Partners tabs, plus `EngagementList` and
 * `ProjectFlowchart`, both their own standalone routes.
 *
 * `AddLocationToLanguage`/`RemoveLocationFromLanguage`,
 * `AssignPersonToPartner`/`RemovePersonFromPartner`, and
 * `AssignOrganizationToUser`/`RemoveOrganizationFromUser` are deliberately
 * NOT covered here — confirmed via source (`LanguageDetailLocations.tsx`,
 * `PartnerDetailPeople.tsx`, `UserPartnersPanel.tsx` all branch on
 * `useIsMobile()`) that the add/remove UI only exists in each component's
 * desktop `DataGridPro` branch; the mobile branch (what every persona in
 * this suite runs at, 500×900, deliberately, per `playwright.config.ts`)
 * renders a read-only `EntityList` instead. These 6 operations are reachable
 * only from a desktop-viewport session — out of scope for this suite's
 * mobile-only persona setup, not a gap in this round's research.
 */
test.describe('entity detail tabs (administrator)', () => {
  test("the seeded language's Locations, Projects, and Posts tabs load", async ({
    page,
  }) => {
    const lookupRes = await page.request.post(`${API_BASE}/graphql`, {
      data: { query: 'query { languages(input:{count:1}) { items { id } } }' },
    });
    const languageId = (await lookupRes.json())?.data?.languages?.items?.[0]
      ?.id;
    expect(
      languageId,
      'expected the seeded fixture language to exist'
    ).toBeTruthy();

    await page.goto(`/languages/${languageId}`);
    await expect(page.getByRole('combobox')).toBeVisible();

    const [locationsResponse] = await Promise.all([
      waitForOperation(page, 'LanguageLocations'),
      switchTab(page, 'Locations'),
    ]);
    expect(
      (await locationsResponse.json())?.errors,
      'expected the Locations tab to load without error'
    ).toBeFalsy();

    const [projectsResponse] = await Promise.all([
      waitForOperation(page, 'LanguageProjects'),
      switchTab(page, 'Projects'),
    ]);
    expect(
      (await projectsResponse.json())?.errors,
      'expected the Projects tab to load without error'
    ).toBeFalsy();

    const [postsResponse] = await Promise.all([
      waitForOperation(page, 'LanguagePostList'),
      switchTab(page, 'Posts'),
    ]);
    expect(
      (await postsResponse.json())?.errors,
      'expected the Posts tab to load without error'
    ).toBeFalsy();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  test("the seeded partner's People, Projects, Engagements, and Notes tabs load", async ({
    page,
  }) => {
    const lookupRes = await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query:
          'query { partners(input:{count:2}) { items { id organization { value { name { value } } } } } }',
      },
    });
    const partners = (await lookupRes.json())?.data?.partners?.items ?? [];
    const partner = partners.find(
      (p: { organization: { value: { name: { value: string } } } }) =>
        p.organization.value.name.value.startsWith('Trantow')
    );
    expect(
      partner?.id,
      'expected the seeded fixture partner to exist'
    ).toBeTruthy();

    await page.goto(`/partners/${partner.id}`);
    await expect(page.getByRole('combobox')).toBeVisible();

    const [peopleResponse] = await Promise.all([
      waitForOperation(page, 'PartnerPeople'),
      switchTab(page, 'People'),
    ]);
    expect(
      (await peopleResponse.json())?.errors,
      'expected the People tab to load without error'
    ).toBeFalsy();

    const [projectsResponse] = await Promise.all([
      waitForOperation(page, 'PartnerProjects'),
      switchTab(page, 'Projects'),
    ]);
    expect(
      (await projectsResponse.json())?.errors,
      'expected the Projects tab to load without error'
    ).toBeFalsy();

    const [engagementsResponse] = await Promise.all([
      waitForOperation(page, 'PartnerDetailEngagements'),
      switchTab(page, 'Engagements'),
    ]);
    expect(
      (await engagementsResponse.json())?.errors,
      'expected the Engagements tab to load without error'
    ).toBeFalsy();

    const [notesResponse] = await Promise.all([
      waitForOperation(page, 'PartnerPostList'),
      switchTab(page, 'Notes'),
    ]);
    expect(
      (await notesResponse.json())?.errors,
      'expected the Notes tab to load without error'
    ).toBeFalsy();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  test("a user's Projects and Partners tabs load", async ({ page }) => {
    const lookupRes = await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query: 'query { users(input:{count:1, filter:{}}) { items { id } } }',
      },
    });
    const userId = (await lookupRes.json())?.data?.users?.items?.[0]?.id;
    expect(userId, 'expected at least one seeded user to exist').toBeTruthy();

    await page.goto(`/users/${userId}`);
    await expect(page.getByRole('combobox')).toBeVisible();

    const [projectsResponse] = await Promise.all([
      waitForOperation(page, 'UserProjects'),
      switchTab(page, 'Projects'),
    ]);
    expect(
      (await projectsResponse.json())?.errors,
      'expected the Projects tab to load without error'
    ).toBeFalsy();

    const [partnersResponse] = await Promise.all([
      waitForOperation(page, 'UserPartners'),
      switchTab(page, 'Partners'),
    ]);
    expect(
      (await partnersResponse.json())?.errors,
      'expected the Partners tab to load without error'
    ).toBeFalsy();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  test('the Engagements list and the Project Flowchart load', async ({
    page,
  }) => {
    const [engagementListResponse] = await Promise.all([
      waitForOperation(page, 'EngagementList'),
      page.goto('/engagements'),
    ]);
    expect(
      (await engagementListResponse.json())?.errors,
      'expected the Engagements list to load without error'
    ).toBeFalsy();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();

    await page.goto('/projects/workflow');
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });
});
