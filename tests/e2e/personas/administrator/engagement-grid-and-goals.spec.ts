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
 * Round 9: `UpdateLanguageEngagementGrid`, `UpdatePartnershipsProducingMediums`,
 * `UpdateDerivativeScriptureProduct`, `UpdateOtherProduct`, and `ProductList`
 * — Round 8's "reachable but needs its own extra setup" residual items.
 *
 * `UpdateLanguageEngagementGrid` turned out to live on the ENGAGEMENTS grid
 * (Partner's Engagements tab, `PartnerDetailEngagements.tsx`), not a
 * "Products grid" at all — a prior research pass's naming conflated it with
 * the unrelated Products form. It's desktop-`DataGridPro`-gated the same way
 * as this round's other grid ops.
 */
test.describe('engagement grid and goal edits (administrator)', () => {
  test.use({ viewport: { width: 1920, height: 1000 } });

  test('UpdateLanguageEngagementGrid via a Partner Engagements grid cell edit', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const langResp = await gql(
      page,
      'query { languages(input:{count:1}) { items { id } } }'
    );
    const languageId = langResp?.data?.languages?.items?.[0]?.id;
    expect(
      languageId,
      'expected the seeded fixture language to exist'
    ).toBeTruthy();

    const orgResp = await gql(
      page,
      `mutation { createOrganization(input:{name:"Playwright Engagement Grid Org ${suffix}"}) { organization { id } } }`
    );
    const orgId = orgResp?.data?.createOrganization?.organization?.id;
    expect(orgId, 'failed to create the throwaway organization').toBeTruthy();

    const partnerResp = await gql(
      page,
      `mutation { createPartner(input:{organization:"${orgId}"}) { partner { id } } }`
    );
    const partnerId = partnerResp?.data?.createPartner?.partner?.id;
    expect(partnerId, 'failed to create the throwaway partner').toBeTruthy();

    const projResp = await gql(
      page,
      `mutation { createProject(input:{name:"Playwright Engagement Grid ${suffix}", type:MomentumTranslation}) { project { id } } }`
    );
    const projectId = projResp?.data?.createProject?.project?.id;
    expect(projectId, 'failed to create the throwaway project').toBeTruthy();

    await gql(
      page,
      `mutation { createPartnership(input:{project:"${projectId}", partner:"${partnerId}"}) { partnership { id } } }`
    );

    const engResp = await gql(
      page,
      `mutation { createLanguageEngagement(input:{project:"${projectId}", language:"${languageId}"}) { engagement { id } } }`
    );
    const engagementId =
      engResp?.data?.createLanguageEngagement?.engagement?.id;
    expect(
      engagementId,
      'failed to create the throwaway engagement'
    ).toBeTruthy();

    await page.goto(`/partners/${partnerId}`);
    await page.getByRole('tab', { name: 'Engagements' }).click();
    const row = page.getByRole('row', { name: /Playwright Engagement Grid/u });
    await expect(row).toBeVisible();

    // Double-clicking the cell already opens the select's option list
    // directly (`GridEditSingleSelectCell` auto-opens on edit start) — no
    // separate click to open a combobox first.
    const aiCell = row.locator('[data-field="usingAIAssistedTranslation"]');
    await aiCell.dblclick();
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateLanguageEngagementGrid'),
      page.getByRole('option', { name: 'Draft', exact: true }).click(),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected UpdateLanguageEngagementGrid to succeed'
    ).toBeFalsy();
    await expect(aiCell).toHaveText('Draft');

    // `errors: null` only proves the mutation was accepted, not that the new
    // value actually persisted server-side (the grid could be showing an
    // optimistic local update that a refetch would silently revert). The tab
    // is URL-synced (`useDetailTabs`), so a reload lands right back here —
    // re-fetch from a clean cache and confirm the edit really stuck.
    await page.reload();
    const reloadedRow = page.getByRole('row', {
      name: /Playwright Engagement Grid/u,
    });
    await expect(reloadedRow).toBeVisible();
    await expect(
      reloadedRow.locator('[data-field="usingAIAssistedTranslation"]')
    ).toHaveText('Draft');

    await gql(
      page,
      `mutation { deleteEngagement(id: "${engagementId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deleteProject(id: "${projectId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deletePartner(id: "${partnerId}") { __typename } }`
    );
  });

  test('UpdatePartnershipsProducingMediums on an existing Goal', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const langResp = await gql(
      page,
      'query { languages(input:{count:1}) { items { id } } }'
    );
    const languageId = langResp?.data?.languages?.items?.[0]?.id;
    expect(
      languageId,
      'expected the seeded fixture language to exist'
    ).toBeTruthy();

    const orgResp = await gql(
      page,
      `mutation { createOrganization(input:{name:"Playwright PPM Org ${suffix}"}) { organization { id } } }`
    );
    const orgId = orgResp?.data?.createOrganization?.organization?.id;
    expect(orgId, 'failed to create the throwaway organization').toBeTruthy();

    const partnerResp = await gql(
      page,
      `mutation { createPartner(input:{organization:"${orgId}"}) { partner { id } } }`
    );
    const partnerId = partnerResp?.data?.createPartner?.partner?.id;
    expect(partnerId, 'failed to create the throwaway partner').toBeTruthy();

    const projResp = await gql(
      page,
      `mutation { createProject(input:{name:"Playwright PPM ${suffix}", type:MomentumTranslation}) { project { id } } }`
    );
    const projectId = projResp?.data?.createProject?.project?.id;
    expect(projectId, 'failed to create the throwaway project').toBeTruthy();

    await gql(
      page,
      `mutation { createPartnership(input:{project:"${projectId}", partner:"${partnerId}"}) { partnership { id } } }`
    );

    const engResp = await gql(
      page,
      `mutation { createLanguageEngagement(input:{project:"${projectId}", language:"${languageId}"}) { engagement { id } } }`
    );
    const engagementId =
      engResp?.data?.createLanguageEngagement?.engagement?.id;
    expect(
      engagementId,
      'failed to create the throwaway engagement'
    ).toBeTruthy();

    const productResp = await gql(
      page,
      `mutation { createDirectScriptureProduct(input:{engagement:"${engagementId}", mediums:[Print]}) { product { id } } }`
    );
    const productId =
      productResp?.data?.createDirectScriptureProduct?.product?.id;
    expect(
      productId,
      `failed to create the throwaway product: ${JSON.stringify(productResp)}`
    ).toBeTruthy();

    await page.goto(`/products/${productId}/edit`);
    await page
      .getByText('Partners Producing these Distribution Methods')
      .click();
    await expect(page.getByLabel('Print')).toBeVisible();
    await page.getByLabel('Print').click();
    const orgOption = page
      .getByRole('option')
      .filter({ hasText: `Playwright PPM Org ${suffix}` });
    await expect(orgOption).toBeVisible();
    await orgOption.click();

    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdatePartnershipsProducingMediums'),
      page.getByRole('button', { name: 'Save Goal' }).click(),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected UpdatePartnershipsProducingMediums to succeed'
    ).toBeFalsy();

    await gql(
      page,
      `mutation { deleteProject(id: "${projectId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deletePartner(id: "${partnerId}") { __typename } }`
    );
  });

  test('UpdateDerivativeScriptureProduct on a Story-type Goal', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const langResp = await gql(
      page,
      'query { languages(input:{count:1}) { items { id } } }'
    );
    const languageId = langResp?.data?.languages?.items?.[0]?.id;
    expect(
      languageId,
      'expected the seeded fixture language to exist'
    ).toBeTruthy();

    const projResp = await gql(
      page,
      `mutation { createProject(input:{name:"Playwright DSP ${suffix}", type:MomentumTranslation}) { project { id } } }`
    );
    const projectId = projResp?.data?.createProject?.project?.id;
    expect(projectId, 'failed to create the throwaway project').toBeTruthy();

    const engResp = await gql(
      page,
      `mutation { createLanguageEngagement(input:{project:"${projectId}", language:"${languageId}"}) { engagement { id } } }`
    );
    const engagementId =
      engResp?.data?.createLanguageEngagement?.engagement?.id;
    expect(
      engagementId,
      'failed to create the throwaway engagement'
    ).toBeTruthy();

    const storyResp = await gql(
      page,
      `mutation { createStory(input:{name:"Playwright Story ${suffix}"}) { story { id } } }`
    );
    const storyId = storyResp?.data?.createStory?.story?.id;
    expect(storyId, 'failed to create the throwaway story').toBeTruthy();

    const productResp = await gql(
      page,
      `mutation { createDerivativeScriptureProduct(input:{engagement:"${engagementId}", produces:"${storyId}", methodology:Paratext}) { product { id } } }`
    );
    const productId =
      productResp?.data?.createDerivativeScriptureProduct?.product?.id;
    expect(
      productId,
      `failed to create the throwaway product: ${JSON.stringify(productResp)}`
    ).toBeTruthy();

    await page.goto(`/products/${productId}/edit`);
    await page.getByText('Methodology').click();
    // This form (unlike the Media wizard step) doesn't `autoSubmit` — a
    // real "Save Goal" click is required after changing the field.
    // `displayMethodology()` renders every enum value containing "Other"
    // (`OtherWritten`/`OtherOralTranslation`/`OtherOralStories`/`OtherVisual`)
    // as the same literal "Other" label, one per approach section — `.first()`
    // picks Written's, i.e. `OtherWritten` (`entries(ApproachMethodologies)`
    // iterates Written first).
    await page
      .getByRole('radio', { name: 'Other', exact: true })
      .first()
      .click();
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateDerivativeScriptureProduct'),
      page.getByRole('button', { name: 'Save Goal' }).click(),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected UpdateDerivativeScriptureProduct to succeed'
    ).toBeFalsy();

    // `errors: null` only proves the mutation was accepted, not that the new
    // methodology actually persisted — re-fetch the product directly rather
    // than re-reading the UI, since all 4 "Other" methodologies render the
    // same ambiguous "Other" label.
    const verifyResp = await gql(
      page,
      `query { product(id: "${productId}") { ... on DerivativeScriptureProduct { methodology { value } } } }`
    );
    expect(
      verifyResp?.data?.product?.methodology?.value,
      `expected methodology to have persisted as OtherWritten: ${JSON.stringify(
        verifyResp
      )}`
    ).toBe('OtherWritten');

    await gql(
      page,
      `mutation { deleteProject(id: "${projectId}") { __typename } }`
    );
  });

  test('UpdateOtherProduct on an Other-type Goal', async ({ page }) => {
    const suffix = Date.now().toString(36);
    const langResp = await gql(
      page,
      'query { languages(input:{count:1}) { items { id } } }'
    );
    const languageId = langResp?.data?.languages?.items?.[0]?.id;
    expect(
      languageId,
      'expected the seeded fixture language to exist'
    ).toBeTruthy();

    const projResp = await gql(
      page,
      `mutation { createProject(input:{name:"Playwright Other Product ${suffix}", type:MomentumTranslation}) { project { id } } }`
    );
    const projectId = projResp?.data?.createProject?.project?.id;
    expect(projectId, 'failed to create the throwaway project').toBeTruthy();

    const engResp = await gql(
      page,
      `mutation { createLanguageEngagement(input:{project:"${projectId}", language:"${languageId}"}) { engagement { id } } }`
    );
    const engagementId =
      engResp?.data?.createLanguageEngagement?.engagement?.id;
    expect(
      engagementId,
      'failed to create the throwaway engagement'
    ).toBeTruthy();

    const productResp = await gql(
      page,
      `mutation { createOtherProduct(input:{engagement:"${engagementId}", title:"Playwright Other Goal ${suffix}"}) { product { id } } }`
    );
    const productId = productResp?.data?.createOtherProduct?.product?.id;
    expect(
      productId,
      `failed to create the throwaway product: ${JSON.stringify(productResp)}`
    ).toBeTruthy();

    await page.goto(`/products/${productId}/edit`);
    await page.getByText('Title & Description').click();
    await page.getByLabel('Description').fill('Playwright test description');
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateOtherProduct'),
      page.getByRole('button', { name: 'Save Goal' }).click(),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected UpdateOtherProduct to succeed'
    ).toBeFalsy();

    await gql(
      page,
      `mutation { deleteProject(id: "${projectId}") { __typename } }`
    );
  });

  /**
   * `ProductList` turned out to be a real, permanent structural dead end,
   * not "straightforward, simply not gotten to" as Round 8 assumed —
   * confirmed live, not guessed. `ProductList` is used in exactly one place
   * (`LanguageEngagementDetail.tsx`'s "Goals" section), but that page's OWN
   * parent query (`LanguageEngagementDetail.graphql`) already fetches
   * `products` inline ("grab first page of products with engagement", per
   * its own source comment) with matching arguments. Apollo's default
   * `cache-first` policy normalizes both queries to the same cache entry,
   * so `ProductList`'s own network request never fires from its one real
   * call site — confirmed by logging every `/graphql` request while
   * visiting the seeded engagement page: only `Engagement` fires, never
   * `ProductList`, even though the "Goals" section renders real data. This
   * isn't a bug (the page works correctly) and there's no other route that
   * reaches this component, so the operation is unreachable in practice.
   */
  test("ProductList's parent query subsumes it — confirmed unreachable in practice, not a bug", async ({
    page,
  }) => {
    const lookupRes = await gql(
      page,
      'query { projects(input:{filter:{name:"Playwright Seed Project"},count:1}) { items { id } } }'
    );
    const projectId = lookupRes?.data?.projects?.items?.[0]?.id;
    expect(
      projectId,
      'expected the seeded fixture project to exist'
    ).toBeTruthy();

    const engResp = await gql(
      page,
      `query { project(id: "${projectId}") { engagements { items { id __typename } } } }`
    );
    const engagement = engResp?.data?.project?.engagements?.items?.find(
      (e: { __typename: string }) => e.__typename === 'LanguageEngagement'
    );
    expect(
      engagement?.id,
      'expected the seeded project to have a LanguageEngagement'
    ).toBeTruthy();

    const requestedOperations: string[] = [];
    page.on('request', (req) => {
      const match = /\/graphql\/([^/?]+)/u.exec(req.url());
      if (match) requestedOperations.push(match[1]!);
    });

    await page.goto(`/engagements/${engagement.id}`);
    await expect(page.getByText('Goals', { exact: true })).toBeVisible();
    await page.waitForTimeout(1000);

    expect(
      requestedOperations,
      'expected the Engagement query to fire (the page loaded real data)'
    ).toContain('Engagement');
    expect(
      requestedOperations,
      "expected ProductList to NOT fire separately — if this now fails, the parent query's inline products fetch was removed and ProductList became reachable again; convert this back into a real coverage test at that point"
    ).not.toContain('ProductList');
  });
});
