import { Page } from '@playwright/test';
import { gql, waitForOperation } from '../../support/graphql';
import { expect, test } from '../../support/test';

// Real click + pressSequentially + settle wait — EditorJS's contenteditable
// doesn't observe .fill(), and its own 200ms/200ms debounce needs real time
// to actually clear its pending-validation state before Submit/autoSubmit
// works (established in project-social.spec.ts's Comments coverage).
const fillRichText = async (page: Page, field: ReturnType<Page['locator']>) => {
  await field.click();
  await field.pressSequentially('Playwright report response');
  await page.waitForTimeout(1000);
};

/**
 * Round 8 (final sweep) of the comprehensive-coverage push: the Multiplication-
 * only report widgets (`NarrativeReports`) plus the three prompt/response
 * steps that turned out NOT to be Multiplication-exclusive despite the
 * research pass's initial premise — confirmed live before writing this:
 * `communityStories.canRead`/`teamNews.canRead`/`varianceExplanation.reasons.canRead`
 * were all already `true` on a plain Momentum-type report too. Only
 * `NarrativeReports` itself (and its dedicated list page) actually check
 * `project.__typename === 'MultiplicationTranslationProject'` — confirmed via
 * source (`NarrativeReportListPage.tsx`). A single throwaway Multiplication
 * project covers all of it in one place, worth doing for real MOU-typed
 * report generation anyway (see below).
 *
 * `report.teamNews.available.prompts`/`report.communityStories.available.prompts`
 * come from `team-news-prompts.ts`/`community-story-prompts.ts` — fixed,
 * hardcoded prompt lists baked into the app, not seeded data — confirmed via
 * source before assuming a fresh report would have anything to select at all.
 *
 * Report generation reuses the same event-driven mechanism found this round
 * for `fieldpartner/workflow-history.spec.ts`'s own report:
 * `SyncProgressReportToEngagementDateRange` fires off `updateProject`'s own
 * `mouStart`/`mouEnd` change (or `updateEngagement`'s date override), not a
 * cron job — setting real dates on a throwaway project synchronously creates
 * real quarterly `NotStarted` reports, no waiting required. Setup only, via
 * direct API (`updateProject`/`updateEngagement` already have their own real
 * UI-driven coverage elsewhere) — this spec's UI-driven steps stay focused on
 * the report wizard itself.
 */
test.describe('multiplication reports (administrator)', () => {
  test('community story, team news, and explanation of progress on a Multiplication report, plus NarrativeReports', async ({
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
      `mutation { createProject(input:{name:"Playwright Multiplication ${suffix}", type:MultiplicationTranslation}) { project { id } } }`
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

    // --- Story (CommunityStory) step ---
    await page.getByRole('button', { name: 'Story', exact: true }).click();
    await expect(
      page.getByText('Share a story from the community')
    ).toBeVisible();

    const firstStoryPrompt = page.getByRole('radio').first();
    await expect(firstStoryPrompt).toBeVisible();
    await firstStoryPrompt.click();
    const [createStoryResponse] = await Promise.all([
      waitForOperation(page, 'CreateCommunityStory'),
      page.getByRole('button', { name: 'Select prompt' }).click(),
    ]);
    expect(
      (await createStoryResponse.json())?.errors,
      'expected selecting a community story prompt to succeed'
    ).toBeFalsy();

    const storyResponseField = page.getByRole('textbox').first();
    await expect(storyResponseField).toBeVisible();
    const [updateStoryResponse] = await Promise.all([
      waitForOperation(page, 'UpdateCommunityStoryResponse'),
      fillRichText(page, storyResponseField),
    ]);
    expect(
      (await updateStoryResponse.json())?.errors,
      'expected saving a community story response to succeed'
    ).toBeFalsy();

    await page.getByRole('button', { name: 'Change Prompt' }).click();
    const secondStoryPrompt = page.getByRole('radio').nth(1);
    await expect(secondStoryPrompt).toBeVisible();
    await secondStoryPrompt.click();
    const [changePromptResponse] = await Promise.all([
      waitForOperation(page, 'ChangeProgressReportCommunityStoryPrompt'),
      page.getByRole('button', { name: 'Select prompt' }).click(),
    ]);
    expect(
      (await changePromptResponse.json())?.errors,
      'expected changing the community story prompt to succeed'
    ).toBeFalsy();

    // --- Team News step ---
    await page.getByRole('button', { name: 'Team News', exact: true }).click();
    await expect(page.getByText('Share some team news')).toBeVisible();

    const [createNewsResponse] = await Promise.all([
      waitForOperation(page, 'CreateProgressReportNews'),
      page.getByRole('button', { name: 'Report News' }).click(),
    ]);
    expect(
      (await createNewsResponse.json())?.errors,
      'expected reporting team news to succeed'
    ).toBeFalsy();

    const newsResponseField = page.getByRole('textbox').first();
    await expect(newsResponseField).toBeVisible();
    const [updateNewsResponse] = await Promise.all([
      waitForOperation(page, 'UpdateProgressReportNewsResponse'),
      fillRichText(page, newsResponseField),
    ]);
    expect(
      (await updateNewsResponse.json())?.errors,
      'expected saving a team news response to succeed'
    ).toBeFalsy();

    // --- Explanation of Progress step ---
    await page
      .getByRole('button', { name: 'Explanation of Progress', exact: true })
      .click();
    await expect(
      page.getByRole('heading', { name: 'Explanation of Progress' })
    ).toBeVisible();

    // "On Time" is the default group for a fresh report (no schedule status
    // set yet) — clicking it again wouldn't be a real value change, so
    // `autoSubmit` never fires. "Ahead" is a genuine change, but its reason
    // options are then required before the (now-invalid) form will submit.
    // These toggle options are each wrapped in a `Tooltip` (e.g. "> 30%" for
    // Ahead) whose title overrides the button's own accessible name even
    // though it has visible text of its own — unlike a FormControlLabel-
    // associated Switch, a plain button's text-derived name isn't protected
    // from an added aria-label — so match on rendered text instead of role.
    await page.getByText('Ahead', { exact: true }).click();
    const firstReason = page.getByRole('radio').first();
    await expect(firstReason).toBeVisible();
    const [explainVarianceResponse] = await Promise.all([
      waitForOperation(page, 'ExplainProgressVariance'),
      firstReason.click(),
    ]);
    expect(
      (await explainVarianceResponse.json())?.errors,
      'expected saving the progress explanation to succeed'
    ).toBeFalsy();

    // --- NarrativeReports (Multiplication-only) ---
    const [narrativeResponse] = await Promise.all([
      waitForOperation(page, 'NarrativeReports'),
      page.goto(`/projects/${projectId}/reports/narrative`),
    ]);
    expect(
      (await narrativeResponse.json())?.errors,
      'expected the Multiplication-only narrative reports page to load without error'
    ).toBeFalsy();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();

    await gql(
      page,
      `mutation { deleteEngagement(id: "${engagementId}") { __typename } }`
    );
    await gql(
      page,
      `mutation { deleteProject(id: "${projectId}") { __typename } }`
    );
  });
});
