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

const createThrowawayProject = async (page: Page, name: string) => {
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

  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Name').fill(name);
  const [response] = await Promise.all([
    waitForOperation(page, 'CreateProject'),
    dialog.getByRole('button', { name: 'Submit' }).click(),
  ]);
  const projectId = (await response.json())?.data?.createProject?.project?.id;
  expect(projectId, 'failed to create the throwaway project').toBeTruthy();
  return projectId as string;
};

const deleteThrowawayProject = (page: Page, projectId: string) =>
  page.request.post(`${API_BASE}/graphql/PlaywrightDeleteProject`, {
    data: {
      operationName: 'PlaywrightDeleteProject',
      query:
        'mutation PlaywrightDeleteProject($id: ID!) { deleteProject(id: $id) { __typename } }',
      variables: { id: projectId },
    },
  });

// The rich-text comment body is an EditorJS contenteditable div, not a plain
// input/textarea — `.fill()` sets a value programmatically, which EditorJS's
// own internal DOM/state management doesn't observe. A real click + typed
// keystrokes does. The field also debounces its own save 200ms after the
// last keystroke (`RichTextField.tsx`'s `useDebounceFn`) — submitting before
// that resolves hits a real client-side "Waiting for editor" validation
// error, not a mutation failure, so a short pause before submit is required.
const fillRichText = async (page: Page, text: string) => {
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').pressSequentially(text);
  await page.waitForTimeout(1000);
};

/**
 * Round 6 of the comprehensive-coverage push: a single throwaway Project
 * covers Comments, Posts, and Pin all at once — `Project` implements
 * `Commentable & Pinnable & Postable` simultaneously (confirmed via schema
 * reading), unlike Engagement (Commentable only) or Language/Partner
 * (Postable + Pinnable, but neither is a throwaway entity this suite
 * creates fresh).
 */
test.describe('project social features (administrator)', () => {
  test('pin/unpin, comment lifecycle, and post lifecycle', async ({ page }) => {
    const projectId = await createThrowawayProject(
      page,
      `Playwright Social ${Date.now().toString(36)}`
    );
    await page.goto(`/projects/${projectId}`);

    // --- Pin ---
    const pinButton = page.getByRole('button', {
      name: 'Pin Project (only affects you)',
    });
    await expect(pinButton).toBeVisible();
    const [pinResponse] = await Promise.all([
      waitForOperation(page, 'TogglePinned'),
      pinButton.click(),
    ]);
    expect(
      (await pinResponse.json())?.errors,
      'expected pinning to succeed'
    ).toBeFalsy();
    const unpinButton = page.getByRole('button', {
      name: 'Unpin Project (only affects you)',
    });
    await expect(unpinButton).toBeVisible();
    const [unpinResponse] = await Promise.all([
      waitForOperation(page, 'TogglePinned'),
      unpinButton.click(),
    ]);
    expect(
      (await unpinResponse.json())?.errors,
      'expected unpinning to succeed'
    ).toBeFalsy();
    await expect(pinButton).toBeVisible();

    // --- Comments ---
    await page.getByRole('button', { name: 'Show Comments' }).click();
    await expect(page.getByText('Comments', { exact: true })).toBeVisible();

    const commentText = `Playwright comment ${Date.now().toString(36)}`;
    await fillRichText(page, commentText);
    const [createCommentResponse] = await Promise.all([
      // Lowercase `c` — confirmed via source reading, an exception to this
      // codebase's otherwise-PascalCase operation naming.
      waitForOperation(page, 'createComment'),
      page.getByRole('button', { name: 'Comment', exact: true }).click(),
    ]);
    expect(
      (await createCommentResponse.json())?.errors,
      'expected creating the comment to succeed'
    ).toBeFalsy();
    await expect(page.getByText(commentText)).toBeVisible();

    // The "⋮" menu button has no Tooltip/aria-label (confirmed via source
    // reading) — scoping by the comment's own `role="listitem"` container
    // narrows it down, but that container also holds a real, visibly-
    // labeled "Reply" button (`CommentThread.tsx`), so a bare
    // `getByRole('button')` still matches two — pinning down the icon via
    // its SVG `data-testid` (same pattern as Round 4's Files-grid actions
    // menu) disambiguates the rest of the way.
    const commentItem = page.getByRole('listitem').filter({
      hasText: commentText,
    });
    await commentItem
      .locator('button:has(svg[data-testid="MoreVertIcon"])')
      .click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();

    const editedCommentText = `${commentText} (edited)`;
    // Scoped to the comment item, not `page` — the drawer's own top-level
    // CreateComment form still has its own (empty) rich text field sitting
    // above this thread the whole time, so an unscoped `getByRole('textbox')`
    // matches both. The field already contains the original text — select
    // all before typing the replacement rather than appending to it.
    const editTextbox = commentItem.getByRole('textbox');
    await editTextbox.click();
    await page.keyboard.press('ControlOrMeta+a');
    await editTextbox.pressSequentially(editedCommentText);
    await page.waitForTimeout(1000);
    const [updateCommentResponse] = await Promise.all([
      waitForOperation(page, 'UpdateComment'),
      page.getByRole('button', { name: 'Update' }).click(),
    ]);
    expect(
      (await updateCommentResponse.json())?.errors,
      'expected updating the comment to succeed'
    ).toBeFalsy();
    await expect(page.getByText(editedCommentText)).toBeVisible();

    const editedCommentItem = page.getByRole('listitem').filter({
      hasText: editedCommentText,
    });
    await editedCommentItem
      .locator('button:has(svg[data-testid="MoreVertIcon"])')
      .click();
    const [deleteCommentResponse] = await Promise.all([
      waitForOperation(page, 'DeleteComment'),
      page.getByRole('menuitem', { name: 'Delete' }).click(),
    ]);
    expect(
      (await deleteCommentResponse.json())?.errors,
      'expected deleting the comment to succeed'
    ).toBeFalsy();
    await expect(page.getByText(editedCommentText)).not.toBeVisible();

    // Close the comments drawer — on this suite's mobile viewport it's a
    // temporary (modal) Drawer, so it'd otherwise keep the rest of the page
    // `aria-hidden`, same class of issue as Round 4's Upload Manager panel.
    await page.getByRole('button', { name: 'Hide Comments' }).click();

    // --- Posts ---
    await page.getByRole('button', { name: 'Add post' }).click();
    const createPostDialog = page.getByRole('dialog');
    await expect(createPostDialog.getByText('Add Post')).toBeVisible();
    const postText = `Playwright post ${Date.now().toString(36)}`;
    await createPostDialog.getByPlaceholder('Say something...').fill(postText);
    const [createPostResponse] = await Promise.all([
      waitForOperation(page, 'CreatePost'),
      createPostDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(
      (await createPostResponse.json())?.errors,
      'expected creating the post to succeed'
    ).toBeFalsy();
    // The dialog's own textarea still holds the same text for a moment
    // after submit — an unscoped `getByText` matches its value too (not
    // just the newly-rendered post), so wait for the dialog to actually
    // close first.
    await expect(createPostDialog).not.toBeVisible();
    await expect(page.getByText(postText)).toBeVisible();

    // Same no-aria-label "⋮" pattern as comments — scope by the post's own
    // Card via its body text instead.
    const postCard = page.locator('.MuiCard-root').filter({
      hasText: postText,
    });
    await postCard.getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Edit Post' }).click();

    const editedPostText = `${postText} (edited)`;
    const editPostDialog = page.getByRole('dialog');
    await expect(editPostDialog.getByText('Edit Post')).toBeVisible();
    await editPostDialog
      .getByPlaceholder('Say something...')
      .fill(editedPostText);
    const [updatePostResponse] = await Promise.all([
      waitForOperation(page, 'UpdatePost'),
      editPostDialog.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(
      (await updatePostResponse.json())?.errors,
      'expected updating the post to succeed'
    ).toBeFalsy();
    await expect(editPostDialog).not.toBeVisible();
    await expect(page.getByText(editedPostText)).toBeVisible();

    const editedPostCard = page.locator('.MuiCard-root').filter({
      hasText: editedPostText,
    });
    await editedPostCard.getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Delete Post' }).click();
    const deletePostDialog = page.getByRole('dialog');
    await expect(deletePostDialog.getByText('Delete Post')).toBeVisible();
    const [deletePostResponse] = await Promise.all([
      waitForOperation(page, 'DeletePost'),
      deletePostDialog.getByRole('button', { name: 'Delete' }).click(),
    ]);
    expect(
      (await deletePostResponse.json())?.errors,
      'expected deleting the post to succeed'
    ).toBeFalsy();
    await expect(page.getByText(editedPostText)).not.toBeVisible();

    await deleteThrowawayProject(page, projectId);
  });
});
