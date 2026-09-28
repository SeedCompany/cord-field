import { join } from 'node:path';
import { gql, waitForOperation } from '../../support/graphql';
import { expect, test } from '../../support/test';

const FIXTURES = join(__dirname, '../../fixtures');

test.describe('PnP upload and reextract (administrator)', () => {
  test('UpdatePeriodicReport (PnP upload) then ReextractPnpProgress', async ({
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
      `mutation { createProject(input:{name:"Playwright PnP ${suffix}", type:MomentumTranslation}) { project { id } } }`
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

    // `ProgressStep.tsx` renders "No progress available for this report"
    // instead of the real `PnpFileAndSummary` content unless the engagement
    // has at least one real product with progress fields set.
    const productResp = await gql(
      page,
      `mutation { createDirectScriptureProduct(input:{engagement:"${engagementId}", methodology:Paratext, progressStepMeasurement:Percent, progressTarget:100, steps:[ExegesisAndFirstDraft]}) { product { id } } }`
    );
    expect(
      productResp?.data?.createDirectScriptureProduct?.product?.id,
      `failed to create the throwaway product: ${JSON.stringify(productResp)}`
    ).toBeTruthy();

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
    await page.locator('form').getByRole('button').first().click();
    await expect(
      page.getByRole('navigation', { name: 'Quarterly Report Steps' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Progress', exact: true }).click();
    await expect(
      page.getByText('Please upload the PnP for this reporting period')
    ).toBeVisible();

    // `ProgressReportCard`'s `DefinedFileCard` intercepts the drop via a
    // custom `onUpload` (`PnpFileAndSummary.tsx`) that stages the file and
    // opens `UpdatePeriodicReportDialog` rather than uploading directly —
    // `DefinedFileCard`'s own `uploadMutationDocument`
    // (`UploadPeriodicReportFile`) is therefore never actually invoked by
    // this flow (confirmed dead code, see HANDOFF.md).
    const fileInput = page.locator(
      'input[name="defined_file_version_uploader"]'
    );
    await fileInput.setInputFiles(join(FIXTURES, 'pnp-sample.xlsx'));

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Upload Report')).toBeVisible();
    await dialog.getByLabel('Received Date').fill('01/01/2025');
    const [updateResponse] = await Promise.all([
      waitForOperation(page, 'UpdatePeriodicReport'),
      dialog.getByRole('button', { name: 'Save' }).click(),
    ]);
    const updateBody = await updateResponse.json();
    expect(
      updateBody?.errors,
      `expected UpdatePeriodicReport (PnP upload) to succeed: ${JSON.stringify(
        updateBody
      )}`
    ).toBeFalsy();

    // `PnPReextractIconButton` is a Tooltip-wrapped `IconButton` with no
    // reliable accessible name (same class of issue documented elsewhere in
    // this suite) — target the icon's own testid instead.
    const reextractButton = page.locator('svg[data-testid="RefreshIcon"]');
    await expect(reextractButton).toBeVisible();
    const [reextractResponse] = await Promise.all([
      waitForOperation(page, 'ReextractPnpProgress'),
      reextractButton.click(),
    ]);
    expect(
      (await reextractResponse.json())?.errors,
      'expected ReextractPnpProgress to succeed'
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
});
