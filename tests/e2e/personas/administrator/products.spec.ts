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

const createThrowawayEngagement = async (page: Page, name: string) => {
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

  const projectDialog = page.getByRole('dialog');
  await projectDialog.getByLabel('Name').fill(name);
  const [projectResponse] = await Promise.all([
    waitForOperation(page, 'CreateProject'),
    projectDialog.getByRole('button', { name: 'Submit' }).click(),
  ]);
  const projectId = (await projectResponse.json())?.data?.createProject?.project
    ?.id;
  expect(projectId, 'failed to create the throwaway project').toBeTruthy();

  await page.goto(`/projects/${projectId}`);
  await page.getByRole('button', { name: 'Add Language Engagement' }).click();
  const engagementDialog = page.getByRole('dialog');
  await engagementDialog.getByLabel('Language').fill('scared-31171d');
  const languageOption = page.getByRole('option', { name: 'scared-31171d' });
  await expect(languageOption).toBeVisible();
  await languageOption.click();
  const [engagementResponse] = await Promise.all([
    waitForOperation(page, 'createLanguageEngagement'),
    engagementDialog.getByRole('button', { name: 'Submit' }).click(),
  ]);
  const engagementId = (await engagementResponse.json())?.data
    ?.createLanguageEngagement?.engagement?.id;
  expect(
    engagementId,
    'failed to create the throwaway language engagement'
  ).toBeTruthy();

  return {
    projectId: projectId as string,
    engagementId: engagementId as string,
  };
};

const cleanupEngagement = async (
  page: Page,
  projectId: string,
  engagementId: string
) => {
  await page.request.post(`${API_BASE}/graphql/PlaywrightDeleteEngagement`, {
    data: {
      operationName: 'PlaywrightDeleteEngagement',
      query:
        'mutation PlaywrightDeleteEngagement($id: ID!) { deleteEngagement(id: $id) { __typename } }',
      variables: { id: engagementId },
    },
  });
  await page.request.post(`${API_BASE}/graphql/PlaywrightDeleteProject`, {
    data: {
      operationName: 'PlaywrightDeleteProject',
      query:
        'mutation PlaywrightDeleteProject($id: ID!) { deleteProject(id: $id) { __typename } }',
      variables: { id: projectId },
    },
  });
};

/**
 * Products ("Goals" in the UI — see ProductDetailHeader.tsx's breadcrumb) has
 * no list route of its own; it's only reachable from a LanguageEngagement's
 * "Goals" section. PRD-1 (pre-cutover-audit-ledger.md: product `readMany`/
 * `list` don't correlate parent project/engagement liveness under Postgres)
 * is a still-open API-contract decision, not a fix — same shape as TU-3/TU-4
 * — and would need soft-deleting a real project/engagement to observe, which
 * breaks the mutation-safety rule (only touch self-created data). Smoke
 * coverage only for now.
 */
test.describe('products (administrator)', () => {
  test('a goal opens from its engagement without error', async ({ page }) => {
    // Not "click the first project in the list" — with `fullyParallel`
    // workers, other specs' own throwaway projects can transiently sort
    // before this suite's one seeded fixture project (alphabetical name
    // sort), and may not have an engagement yet. Looking up the known
    // seed project (see HANDOFF.md's seed-data section) by name directly
    // avoids that race entirely.
    const lookupRes = await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query:
          'query { projects(input:{filter:{name:"Playwright Seed Project"},count:1}) { items { engagements { items { id } } } } }',
      },
    });
    const engagementId = (await lookupRes.json())?.data?.projects?.items?.[0]
      ?.engagements?.items?.[0]?.id;
    expect(
      engagementId,
      'expected the seeded fixture project to have at least one engagement'
    ).toBeTruthy();

    await page.goto(`/engagements/${engagementId}`);
    await page.waitForURL(/\/engagements\/[^/]+$/u);

    // Not `getByRole('heading', ...)` — this particular label is a
    // `Grid item component={Typography} variant="h3"`, and Grid doesn't
    // forward the unrecognized `variant` prop to Typography, so it renders
    // as plain untagged text rather than an actual `<h3>` (unlike the
    // "Tools" section right above it, a plain `<Typography variant="h3">`).
    await expect(page.getByText('Goals', { exact: true })).toBeVisible();

    const productLink = page.locator('a[href^="/products/"]').first();
    await expect(productLink).toBeVisible();
    await productLink.click();

    await page.waitForURL(/\/products\/[^/]+$/u);
    const heading = page.getByRole('heading', { level: 2 }).first();
    await expect(heading).toBeVisible();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  /**
   * Round 7 of the comprehensive-coverage push: a throwaway LanguageEngagement's
   * "Goals" full create→edit→delete lifecycle. `CreateProduct`/`EditProduct`
   * share one component (`ProductForm.tsx`) reached at real routes
   * (`/engagements/:id/products/create`, `/products/:id/edit`) rather than a
   * dialog — confirmed via source reading, not guessed. The subtype
   * (`productType`) is a toggle-button field inside the form's first
   * accordion, not a separate wizard step, and defaults to
   * `DirectScriptureProduct` — a fresh Direct Scripture goal needs zero
   * interaction beyond clicking "Save Goal".
   */
  test('create, edit, and delete a Direct Scripture goal', async ({ page }) => {
    const { projectId, engagementId } = await createThrowawayEngagement(
      page,
      `Playwright Product ${Date.now().toString(36)}`
    );

    await page.goto(`/engagements/${engagementId}/products/create`);
    const [createResponse] = await Promise.all([
      waitForOperation(page, 'CreateDirectScriptureProduct'),
      page.getByRole('button', { name: 'Save Goal' }).click(),
    ]);
    const createBody = await createResponse.json();
    // `createProduct` — a GraphQL field alias shared by all three
    // Create*Product mutations (`CreateProduct.graphql`), regardless of
    // which one actually fired over the wire.
    const productId = createBody?.data?.createProduct?.product?.id;
    expect(
      productId,
      `failed to create the Direct Scripture goal: ${JSON.stringify(
        createBody
      )}`
    ).toBeTruthy();

    await page.goto(`/products/${productId}/edit`);
    // "Distribution Methods" — a real, simple field to dirty for a
    // meaningful edit (toggle-button multi-select, no dependent fields).
    // exact — this substring-matches the later "Partners Producing these
    // Distribution Methods" section's closed title too.
    await page
      .getByRole('button', { name: 'Distribution Methods', exact: true })
      .click();
    // Once open, the accordion's own title gains a "Choose " prefix
    // (`DefaultAccordion.tsx`) — unlike its closed title, that no longer
    // collides with "Partners Producing these Distribution Methods", so
    // scoping by it disambiguates the toggle-button options inside from
    // every other section's buttons on the page.
    const mediumsAccordion = page
      .locator('.MuiAccordion-root')
      .filter({ hasText: 'Choose Distribution Methods' });
    const mediumOption = mediumsAccordion
      .locator('.MuiToggleButton-root')
      .first();
    await expect(mediumOption).toBeVisible();
    await mediumOption.click();
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateDirectScriptureProduct'),
      page.getByRole('button', { name: 'Save Goal' }).click(),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected updating the distribution methods to succeed'
    ).toBeFalsy();

    await page.goto(`/products/${productId}/edit`);
    const [deleteResponse] = await Promise.all([
      waitForOperation(page, 'DeleteProduct'),
      page.getByRole('button', { name: 'Delete Goal' }).click(),
    ]);
    expect(
      (await deleteResponse.json())?.errors,
      'expected deleting the goal to succeed'
    ).toBeFalsy();

    await cleanupEngagement(page, projectId, engagementId);
  });

  test('create and delete an Other goal', async ({ page }) => {
    const { projectId, engagementId } = await createThrowawayEngagement(
      page,
      `Playwright Product Other ${Date.now().toString(36)}`
    );

    await page.goto(`/engagements/${engagementId}/products/create`);
    await page.getByRole('button', { name: 'Other', exact: true }).click();
    // "Title & Description" uses a different accordion key (`title`) than
    // "Goal" (`produces`), so — unlike Story/Film/EthnoArt below — it stays
    // collapsed after picking the subtype and needs an explicit click.
    await page.getByRole('button', { name: 'Title & Description' }).click();
    await page
      .getByLabel('Title', { exact: true })
      .fill(`Playwright Other Goal ${Date.now().toString(36)}`);
    const [createResponse] = await Promise.all([
      waitForOperation(page, 'CreateOtherProduct'),
      page.getByRole('button', { name: 'Save Goal' }).click(),
    ]);
    const createBody = await createResponse.json();
    const productId = createBody?.data?.createProduct?.product?.id;
    expect(
      productId,
      `failed to create the Other goal: ${JSON.stringify(createBody)}`
    ).toBeTruthy();

    await page.goto(`/products/${productId}/edit`);
    const [deleteResponse] = await Promise.all([
      waitForOperation(page, 'DeleteProduct'),
      page.getByRole('button', { name: 'Delete Goal' }).click(),
    ]);
    expect(
      (await deleteResponse.json())?.errors,
      'expected deleting the goal to succeed'
    ).toBeFalsy();

    await cleanupEngagement(page, projectId, engagementId);
  });

  /**
   * Story/Film/EthnoArt goals all go through `DerivativeScriptureProduct`,
   * differentiated only by which polymorphic `produces` lookup accepts the
   * selection. Each lookup's "Create "<query>"" fallback option (confirmed
   * exact double-quoted text via source reading) opens a small inline
   * create dialog whose one required field is pre-filled with the typed
   * query (`getInitialValues: (name) => ({ name })`) — combined with
   * `sendIfClean` (set generically by `LookupField` for every inline-create
   * dialog), that means no further typing is needed before Submit.
   */
  for (const {
    toggle,
    fieldPlaceholder,
    createOperation,
    mutationField,
    resultField,
    deleteMutation,
  } of [
    {
      toggle: 'Story',
      fieldPlaceholder: 'Search for a story by name',
      createOperation: 'CreateStory',
      mutationField: 'createStory',
      resultField: 'story',
      deleteMutation: 'deleteStory',
    },
    {
      toggle: 'Film',
      fieldPlaceholder: 'Search for a film by name',
      createOperation: 'CreateFilm',
      mutationField: 'createFilm',
      resultField: 'film',
      deleteMutation: 'deleteFilm',
    },
    {
      toggle: 'Ethno Art',
      fieldPlaceholder: 'Search for an EthnoArt by name',
      createOperation: 'CreateEthnoArt',
      mutationField: 'createEthnoArt',
      resultField: 'ethnoArt',
      deleteMutation: 'deleteEthnoArt',
    },
  ]) {
    test(`create and delete a ${toggle} goal via its inline lookup-create`, async ({
      page,
    }) => {
      const { projectId, engagementId } = await createThrowawayEngagement(
        page,
        `Playwright Product ${toggle} ${Date.now().toString(36)}`
      );

      await page.goto(`/engagements/${engagementId}/products/create`);
      await page.getByRole('button', { name: toggle, exact: true }).click();

      const producibleName = `Playwright ${toggle} ${Date.now().toString(36)}`;
      // The "Goal" accordion (`produces`) doubles as this lookup's own
      // accordion for Story/Film/EthnoArt, so it's already expanded — no
      // extra click needed, unlike Other's "Title & Description" above.
      // Not `getByLabel` — the `productType` toggle-group also renders a
      // same-named hidden radio input (e.g. `input[name="Film"]`) sharing
      // the same accessible label text, so an exact-label lookup is
      // ambiguous; the placeholder is unique to the lookup field itself.
      await page.getByPlaceholder(fieldPlaceholder).fill(producibleName);
      const createOption = page.getByRole('option', {
        name: `Create "${producibleName}"`,
      });
      await expect(createOption).toBeVisible();
      await createOption.click();

      const createDialog = page.getByRole('dialog');
      await expect(createDialog).toBeVisible();
      const [createLookupResponse] = await Promise.all([
        waitForOperation(page, createOperation),
        createDialog.getByRole('button', { name: 'Submit' }).click(),
      ]);
      const createLookupBody = await createLookupResponse.json();
      // The reliable source for the producible's id — the product's own
      // create response doesn't select `produces` at all (`ProductCard`
      // fragment has no such field, confirmed via source reading).
      const producibleId =
        createLookupBody?.data?.[mutationField]?.[resultField]?.id;
      expect(
        producibleId,
        `failed to create the ${toggle} lookup item: ${JSON.stringify(
          createLookupBody
        )}`
      ).toBeTruthy();
      await expect(createDialog).not.toBeVisible();

      // "Progress Target" only renders when the selected methodology's
      // default measurement is `Number` rather than `Percent`
      // (`ProgressTargetSection.tsx`) — which methodology gets defaulted
      // differs by producible type, so this is required for some of
      // Story/Film/EthnoArt and not others. When present (its accordion
      // auto-opens on its own validation error), it blocks "Save Goal"
      // until filled.
      const progressTargetField = page.getByLabel('Progress Target');
      if (await progressTargetField.isVisible().catch(() => false)) {
        await progressTargetField.fill('50');
      }

      const [createProductResponse] = await Promise.all([
        waitForOperation(page, 'CreateDerivativeScriptureProduct'),
        page.getByRole('button', { name: 'Save Goal' }).click(),
      ]);
      const createProductBody = await createProductResponse.json();
      const productId = createProductBody?.data?.createProduct?.product?.id;
      expect(
        productId,
        `failed to create the ${toggle} goal: ${JSON.stringify(
          createProductBody
        )}`
      ).toBeTruthy();

      await page.goto(`/products/${productId}/edit`);
      const [deleteProductResponse] = await Promise.all([
        waitForOperation(page, 'DeleteProduct'),
        page.getByRole('button', { name: 'Delete Goal' }).click(),
      ]);
      expect(
        (await deleteProductResponse.json())?.errors,
        'expected deleting the goal to succeed'
      ).toBeFalsy();

      // The goal's deletion doesn't delete the underlying Story/Film/
      // EthnoArt entity it produces — clean that up directly too.
      if (producibleId) {
        await page.request.post(`${API_BASE}/graphql/PlaywrightCleanup`, {
          data: {
            operationName: 'PlaywrightCleanup',
            query: `mutation PlaywrightCleanup($id: ID!) { ${deleteMutation}(id: $id) { __typename } }`,
            variables: { id: producibleId },
          },
        });
      }

      await cleanupEngagement(page, projectId, engagementId);
    });
  }
});
