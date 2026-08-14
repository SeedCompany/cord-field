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

// `RichText` is a JSON-object scalar, not a string — the GraphQL query must
// embed it as a literal object, not a JSON-encoded string (confirmed live:
// passing a stringified JSON blob fails with "JSONObject cannot represent
// non-object value").
const richText = (text: string) =>
  `{version: "2.25.0", time: 1700000000000, blocks: [{id: "ppwt1", type: "paragraph", data: {text: "${text}"}}]}`;

/**
 * Round 9: `ProgressReportsOfEngagement`, `UpdatePeriodicReport` (Skip/
 * Unskip), and `LoadMoreComments` — Round 8's "straightforward, plain
 * queries/reversible flows, not gotten to" residual items.
 */
test.describe('progress reports and comments (administrator)', () => {
  test('ProgressReportsOfEngagement fires when loading the reports/progress page', async ({
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
      `mutation { createProject(input:{name:"Playwright PRoE ${suffix}", type:MomentumTranslation}) { project { id } } }`
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

    const [reportsResponse] = await Promise.all([
      waitForOperation(page, 'ProgressReportsOfEngagement'),
      page.goto(`/engagements/${engagementId}/reports/progress`),
    ]);
    expect(
      (await reportsResponse.json())?.errors,
      'expected ProgressReportsOfEngagement to load without error'
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

  test('UpdatePeriodicReport via Skip then Unskip', async ({ page }) => {
    // At the default 500×900 persona viewport, this table's leading columns
    // (Period, Submitted By, Submitted Date, ...) already fill the width —
    // DataGridPro virtualizes the further-right actions column (with the
    // Skip kebab menu) out of the DOM entirely, same root cause found
    // earlier this round on the User Partners grid.
    await page.setViewportSize({ width: 1280, height: 900 });
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

    // The `/reports/progress` page (`ProgressReportListPage.tsx`) uses its
    // OWN local, simplified 2-column table (Period/Status, row click just
    // navigates away) — confirmed via source, no kebab/Skip action exists
    // there at all. `/reports/narrative` (`NarrativeReportListPage.tsx`)
    // uses the real, generic `PeriodicReportsTable` WITH the Skip kebab
    // menu — but it's gated to Multiplication-type projects only.
    const projResp = await gql(
      page,
      `mutation { createProject(input:{name:"Playwright Skip ${suffix}", type:MultiplicationTranslation}) { project { id } } }`
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

    await page.goto(`/engagements/${engagementId}/reports/narrative`);
    const row = page.getByRole('row').filter({ hasText: 'FY' }).first();
    await expect(row).toBeVisible();
    await row.getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Skip', exact: true }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Skip Report')).toBeVisible();
    await dialog.getByLabel('Reason').fill('Playwright test skip reason');
    const [skipResponse] = await Promise.all([
      waitForOperation(page, 'UpdatePeriodicReport'),
      dialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(
      (await skipResponse.json())?.errors,
      'expected skipping the report to succeed'
    ).toBeFalsy();

    await row.getByRole('button').click();
    // Menu item text is `startCase(FileAction.EditSkipReason)` — lodash's
    // `startCase` splits camelCase too, so the enum value `EditSkipReason`
    // renders as "Edit Skip Reason", not the literal enum string.
    await page.getByRole('menuitem', { name: 'Edit Skip Reason' }).click();
    const editDialog = page.getByRole('dialog');
    await expect(editDialog.getByText('Edit Skip Reason')).toBeVisible();
    const [unskipResponse] = await Promise.all([
      waitForOperation(page, 'UpdatePeriodicReport'),
      editDialog.getByRole('button', { name: 'Unskip' }).click(),
    ]);
    expect(
      (await unskipResponse.json())?.errors,
      'expected unskipping the report to succeed'
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

  test('LoadMoreComments on a thread with more than a page of replies', async ({
    page,
  }) => {
    const suffix = Date.now().toString(36);
    const projResp = await gql(
      page,
      `mutation { createProject(input:{name:"Playwright Comments ${suffix}", type:MomentumTranslation}) { project { id } } }`
    );
    const projectId = projResp?.data?.createProject?.project?.id;
    expect(projectId, 'failed to create the throwaway project').toBeTruthy();

    const firstResp = await gql(
      page,
      `mutation { createComment(input:{resource:"${projectId}", body:${richText(
        'Playwright first comment'
      )}}) { commentThread { id } } }`
    );
    const threadId = firstResp?.data?.createComment?.commentThread?.id;
    expect(
      threadId,
      `failed to create the first comment: ${JSON.stringify(firstResp)}`
    ).toBeTruthy();

    // 25 is the default page size for a thread's own comments — 25 replies
    // (26 total including the first comment) reliably exceeds it.
    for (const i of Array.from({ length: 25 }, (_, n) => n)) {
      const replyResp = await gql(
        page,
        `mutation { createComment(input:{resource:"${projectId}", thread:"${threadId}", body:${richText(
          `Playwright reply ${i}`
        )}}) { comment { id } } }`
      );
      expect(
        replyResp?.errors,
        `failed to create reply ${i}: ${JSON.stringify(replyResp)}`
      ).toBeFalsy();
    }

    await page.goto(`/projects/${projectId}`);
    await page.getByRole('button', { name: /Comments$/u }).click();
    await expect(page.getByText('Playwright first comment')).toBeVisible();
    await page.getByRole('button', { name: /replies$/u }).click();
    // The initial page (default count 25 of 26 total) holds the 25 MOST
    // RECENT replies — "reply 24" (created last) is on it; "reply 0"
    // (created first, so oldest) is the one item pushed onto the second
    // page, only revealed after Load More.
    await expect(page.getByText('Playwright reply 24')).toBeVisible();
    await expect(page.getByText('Playwright reply 0')).not.toBeVisible();

    const [loadMoreResponse] = await Promise.all([
      waitForOperation(page, 'LoadMoreComments'),
      page.getByRole('button', { name: 'Load More' }).click(),
    ]);
    expect(
      (await loadMoreResponse.json())?.errors,
      'expected LoadMoreComments to succeed'
    ).toBeFalsy();
    await expect(page.getByText('Playwright reply 0')).toBeVisible();

    await gql(
      page,
      `mutation { deleteProject(id: "${projectId}") { __typename } }`
    );
  });
});
