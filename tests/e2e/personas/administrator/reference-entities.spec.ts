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
 * Round 7 of the comprehensive-coverage push: two small reference-entity
 * "inline lookup create" flows that don't fit under Products —
 * `FundingAccount` (a Location field) and `Organization` (a Partner field,
 * and required there — every Partner is inherently backed by an
 * Organization). Both use the same `LookupField.createFor` pattern as
 * Round 7's Story/Film/EthnoArt goals: type a name, click the
 * `Create "<query>"` fallback option, and the inline dialog opens with its
 * name field pre-filled.
 */
test.describe('reference entity inline-creates (administrator)', () => {
  test('create a location with an inline-created funding account', async ({
    page,
  }) => {
    await openCreateMenu(page, 'Location');

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Create Location')).toBeVisible();
    const suffix = Date.now().toString(36);
    await dialog
      .getByLabel('Location Name')
      .fill(`Playwright Location ${suffix}`);
    await dialog.getByLabel('ISO Alpha-3 Country Code').fill('TUV');

    const fundingAccountName = `Playwright Funding Account ${suffix}`;
    await dialog.getByLabel('Funding Account').fill(fundingAccountName);
    const createOption = page.getByRole('option', {
      name: `Create "${fundingAccountName}"`,
    });
    await expect(createOption).toBeVisible();
    await createOption.click();

    const createFundingAccountDialog = page.getByRole('dialog').filter({
      hasText: 'Create Funding Account',
    });
    await expect(createFundingAccountDialog).toBeVisible();
    // "Account Name" is pre-filled from the typed query; "Account Number"
    // has no default and is required (`validate={[required, min(0), max(9)]}`
    // — confirmed via source reading, a single digit).
    await createFundingAccountDialog.getByLabel('Account Number').fill('5');
    const [createFundingAccountResponse] = await Promise.all([
      waitForOperation(page, 'CreateFundingAccount'),
      createFundingAccountDialog
        .getByRole('button', { name: 'Submit' })
        .click(),
    ]);
    const fundingAccountBody = await createFundingAccountResponse.json();
    const fundingAccountId =
      fundingAccountBody?.data?.createFundingAccount?.fundingAccount?.id;
    expect(
      fundingAccountId,
      `failed to create the funding account: ${JSON.stringify(
        fundingAccountBody
      )}`
    ).toBeTruthy();
    await expect(createFundingAccountDialog).not.toBeVisible();

    const [createLocationResponse] = await Promise.all([
      waitForOperation(page, 'CreateLocation'),
      dialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const locationBody = await createLocationResponse.json();
    const locationId = locationBody?.data?.createLocation?.location?.id;
    expect(
      locationId,
      `failed to create the location: ${JSON.stringify(locationBody)}`
    ).toBeTruthy();

    await page.request.post(`${API_BASE}/graphql/PlaywrightDeleteLocation`, {
      data: {
        operationName: 'PlaywrightDeleteLocation',
        query:
          'mutation PlaywrightDeleteLocation($id: ID!) { deleteLocation(id: $id) { __typename } }',
        variables: { id: locationId },
      },
    });
    await page.request.post(
      `${API_BASE}/graphql/PlaywrightDeleteFundingAccount`,
      {
        data: {
          operationName: 'PlaywrightDeleteFundingAccount',
          query:
            'mutation PlaywrightDeleteFundingAccount($id: ID!) { deleteFundingAccount(id: $id) { __typename } }',
          variables: { id: fundingAccountId },
        },
      }
    );
  });

  test('create a partner with an inline-created organization', async ({
    page,
  }) => {
    await openCreateMenu(page, 'Partner');

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Create Partner')).toBeVisible();
    const orgName = `Playwright Organization ${Date.now().toString(36)}`;
    await dialog.getByLabel('Organization').fill(orgName);
    const createOption = page.getByRole('option', {
      name: `Create "${orgName}"`,
    });
    await expect(createOption).toBeVisible();
    await createOption.click();

    const createOrgDialog = page.getByRole('dialog').filter({
      hasText: 'Create Organization',
    });
    await expect(createOrgDialog).toBeVisible();
    // Its one field ("Name") is pre-filled from the typed query, and
    // `LookupField` passes `sendIfClean` to every inline-create dialog — a
    // clean Submit is enough, no further typing needed.
    const [createOrgResponse] = await Promise.all([
      // Lowercase `c` — confirmed via source reading, same class of
      // exception as `createComment`/`createLanguageEngagement`.
      waitForOperation(page, 'createOrganization'),
      createOrgDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const orgBody = await createOrgResponse.json();
    const organizationId = orgBody?.data?.createOrganization?.organization?.id;
    expect(
      organizationId,
      `failed to create the organization: ${JSON.stringify(orgBody)}`
    ).toBeTruthy();
    await expect(createOrgDialog).not.toBeVisible();

    const [createPartnerResponse] = await Promise.all([
      waitForOperation(page, 'CreatePartner'),
      dialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const partnerBody = await createPartnerResponse.json();
    const partnerId = partnerBody?.data?.createPartner?.partner?.id;
    expect(
      partnerId,
      `failed to create the partner: ${JSON.stringify(partnerBody)}`
    ).toBeTruthy();

    await page.request.post(`${API_BASE}/graphql/PlaywrightDeletePartner`, {
      data: {
        operationName: 'PlaywrightDeletePartner',
        query:
          'mutation PlaywrightDeletePartner($id: ID!) { deletePartner(id: $id) { __typename } }',
        variables: { id: partnerId },
      },
    });
    await page.request.post(
      `${API_BASE}/graphql/PlaywrightDeleteOrganization`,
      {
        data: {
          operationName: 'PlaywrightDeleteOrganization',
          query:
            'mutation PlaywrightDeleteOrganization($id: ID!) { deleteOrganization(id: $id) { __typename } }',
          variables: { id: organizationId },
        },
      }
    );
  });
});
