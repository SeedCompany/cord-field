import { join } from 'node:path';
import { waitForOperation } from '../../support/graphql';
import {
  createThrowawayProject,
  deleteThrowawayProject,
} from '../../support/projects';
import { expect, test } from '../../support/test';

const FIXTURES = join(__dirname, '../../fixtures');

/**
 * Round 4 of the comprehensive-coverage push: "defined file" cards — a
 * single fixed-slot file (not a directory tree) attached directly to a
 * parent entity. `LanguageEngagement.pnp` ("Planning Spreadsheet") is the
 * only one of these reachable off throwaway, self-created data (Progress
 * Report's own PnP card and the InternshipEngagement growth plan — the
 * latter dead code, no UI at all — both need an existing seeded report or
 * are unreachable; see HANDOFF.md).
 */
test.describe('defined files (administrator)', () => {
  test('upload a Planning Spreadsheet onto a language engagement', async ({
    page,
  }) => {
    const projectId = await createThrowawayProject(
      page,
      `Playwright Defined Files ${Date.now().toString(36)}`
    );

    await page.goto(`/projects/${projectId}`);
    await page.getByRole('button', { name: 'Add Language Engagement' }).click();
    const createDialog = page.getByRole('dialog');
    await createDialog.getByLabel('Language').fill('scared-31171d');
    const languageOption = page.getByRole('option', {
      name: 'scared-31171d',
    });
    await expect(languageOption).toBeVisible();
    await languageOption.click();
    const [createResponse] = await Promise.all([
      waitForOperation(page, 'createLanguageEngagement'),
      createDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    const engagementId = (await createResponse.json())?.data
      ?.createLanguageEngagement?.engagement?.id;
    expect(
      engagementId,
      'failed to create the throwaway language engagement'
    ).toBeTruthy();

    await page.goto(`/engagements/${engagementId}`);
    await expect(
      page.getByText('Add Planning Spreadsheet', { exact: true })
    ).toBeVisible();

    // `DefinedFileCard`'s dropzone is `noClick: !!file` — always clickable
    // via a real picker when empty, but `setInputFiles` on the hidden
    // input works regardless either way.
    const uploadInput = page.locator(
      'input[name="defined_file_version_uploader"]'
    );
    await uploadInput.setInputFiles(join(FIXTURES, 'tiny.txt'));

    // `PlanningSpreadsheet.tsx` intercepts every upload with an
    // "Extract Goals?" dialog (`onUpload` prop) before the real
    // `UploadLanguageEngagementPnp` mutation fires — confirmed via source
    // reading, not guessed; skipped here via the default option so this
    // stays scoped to file-upload coverage, not goal extraction.
    const extractDialog = page.getByRole('dialog');
    await expect(extractDialog.getByText('Extract Goals?')).toBeVisible();
    const [uploadResponse] = await Promise.all([
      waitForOperation(page, 'UploadLanguageEngagementPnp'),
      extractDialog.getByRole('button', { name: 'Upload' }).click(),
    ]);
    expect(
      (await uploadResponse.json())?.errors,
      'expected the Planning Spreadsheet upload to succeed'
    ).toBeFalsy();
    // Not `expect(extractDialog).not.toBeVisible()` — the Upload Manager
    // panel (open in the corner from this same upload) is *also* a
    // `role="dialog"` (`DraggableDialog` wraps MUI `Dialog`), so an
    // unscoped page-level dialog locator never resolves to zero matches.
    await expect(page.getByText('Extract Goals?')).not.toBeVisible();
    // Not a bare page-level locator — the Upload Manager panel lists the
    // same filename in its own completed-uploads history.
    await expect(page.locator('#root').getByText('tiny.txt')).toBeVisible();

    await deleteThrowawayProject(page, projectId);
  });
});
