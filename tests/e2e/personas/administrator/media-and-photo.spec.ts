import { Page } from '@playwright/test';
import { join } from 'node:path';
import { expect, test } from '../../support/test';

const API_BASE = process.env.RAZZLE_API_BASE_URL ?? 'http://localhost:3000';
const FIXTURES = join(__dirname, '../../fixtures');

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
 * Round 9: the Media wizard step (`CreateMedia`/`UpdateMedia`/`DeleteMedia`)
 * and `UpdateUserPhoto` — both deferred out of Round 8 as "needs a report
 * already transitioned out of NotStarted (now easy to get) plus a real image
 * fixture" / "needs a throwaway registered account, not attempted this
 * round." Both preconditions are now satisfied: `tiny.png` already exists in
 * `tests/e2e/fixtures/` (added for Round 4's Files/Media coverage), and this
 * round's other specs already re-confirm the `mouStart`/`mouEnd` report-
 * generation trick.
 */
test.describe('media and user photo (administrator)', () => {
  test('CreateMedia, UpdateMedia, and DeleteMedia on a progress report', async ({
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
      `mutation { createProject(input:{name:"Playwright Media ${suffix}", type:MomentumTranslation}) { project { id } } }`
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

    const dateResp = await gql(
      page,
      `mutation { updateProject(input:{id:"${projectId}", mouStart:"2025-01-01", mouEnd:"2026-12-31"}) { project { id } } }`
    );
    expect(
      dateResp?.errors,
      `expected setting mou dates to generate real reports: ${JSON.stringify(
        dateResp
      )}`
    ).toBeFalsy();

    const reportsResp = await gql(
      page,
      `query { engagement(id: "${engagementId}") { ... on LanguageEngagement { progressReports(input:{count:20}) { items { id status { value } } } } } }`
    );
    const reportId =
      reportsResp?.data?.engagement?.progressReports?.items?.find(
        (r: { status: { value: string } }) => r.status.value === 'NotStarted'
      )?.id;
    expect(
      reportId,
      `expected at least one NotStarted report to be generated: ${JSON.stringify(
        reportsResp
      )}`
    ).toBeTruthy();

    await page.goto(`/progress-reports/${reportId}/edit`);
    await expect(
      page.getByText('This report has not yet been started')
    ).toBeVisible();
    // Scope to the transition form specifically — a broad "any button with text" selector can match the account-menu button once real notifications accumulate there (e.g. from dashboard-and-notifications.spec.ts's ReadNotification test).
    await page.locator('form').getByRole('button').first().click();
    await expect(
      page.getByRole('navigation', { name: 'Quarterly Report Steps' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Media', exact: true }).click();
    await expect(
      page.getByText('Upload an image to go with your Report')
    ).toBeVisible();

    // Every variant's `AccordionDetails` (and its own `name="newFile"` file
    // input) stays mounted in the DOM even while collapsed — MUI's
    // `Collapse` hides it visually, it doesn't unmount it — so scope to the
    // first accordion's own root, not just its summary, to avoid matching
    // all 4 variants' inputs at once.
    const firstAccordion = page.locator('.MuiAccordion-root').first();
    await firstAccordion.locator('.MuiAccordionSummary-root').click();

    const fileInput = firstAccordion.locator('input[name="newFile"]');
    const [createResponse] = await Promise.all([
      waitForOperation(page, 'CreateMedia'),
      fileInput.setInputFiles(join(FIXTURES, 'tiny.png')),
    ]);
    const createBody = await createResponse.json();
    expect(
      createBody?.errors,
      `expected CreateMedia to succeed: ${JSON.stringify(createBody)}`
    ).toBeFalsy();

    await expect(page.getByLabel('Caption')).toBeVisible();
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdateMedia'),
      page.getByLabel('Caption').fill('Playwright test caption'),
    ]);
    expect(
      (await updateResponse.json())?.errors,
      'expected UpdateMedia to succeed'
    ).toBeFalsy();

    // The Upload Manager panel (`UploadManagerUIShell.tsx`) is a real MUI
    // `Dialog` with `hideBackdrop` — visually a small corner widget, but
    // MUI's Modal machinery still marks the rest of the page
    // `aria-hidden="true"` while it's open, hanging every subsequent
    // `getByRole` query elsewhere on the page (a known, documented,
    // pre-existing bug — see project-files.spec.ts's own note on this).
    // Close it explicitly before continuing.
    await page.getByRole('button', { name: 'close' }).click();

    await page.getByRole('button', { name: 'more image actions' }).click();
    const [deleteResponse] = await Promise.all([
      waitForOperation(page, 'DeleteMedia'),
      page.getByRole('menuitem', { name: 'Delete' }).click(),
    ]);
    expect(
      (await deleteResponse.json())?.errors,
      'expected DeleteMedia to succeed'
    ).toBeFalsy();

    await gql(
      page,
      `mutation { deleteEngagement(id: "${engagementId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deleteProject(id: "${projectId}") { __typename } }`
    );
  });

  test("UpdateUserPhoto via a throwaway person's own profile", async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const personResp = await gql(
      page,
      `mutation { createPerson(input:{realFirstName:"Playwright", realLastName:"Photo${suffix}", displayFirstName:"Playwright", displayLastName:"Photo${suffix}"}) { user { id } } }`
    );
    const userId = personResp?.data?.createPerson?.user?.id;
    expect(userId, 'failed to create the throwaway user').toBeTruthy();

    await page.goto(`/users/${userId}`);
    const photoInput = page.locator('input[name="user_photo_uploader"]');
    const [uploadResponse] = await Promise.all([
      waitForOperation(page, 'UpdateUserPhoto'),
      photoInput.setInputFiles(join(FIXTURES, 'tiny.png')),
    ]);
    expect(
      (await uploadResponse.json())?.errors,
      'expected UpdateUserPhoto to succeed'
    ).toBeFalsy();

    await gql(page, `mutation { deleteUser(id: "${userId}") { __typename } }`);
  });
});
