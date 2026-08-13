import { expect, test } from '../../support/test';

const API_BASE = process.env.RAZZLE_API_BASE_URL ?? 'http://localhost:3000';

test.describe('tools (administrator)', () => {
  test('list loads and a tool detail page opens', async ({ page }) => {
    await page.goto('/tools');

    const main = page.getByRole('main');
    const toolLink = main.getByRole('link').first();
    await expect(toolLink).toBeVisible();
    await toolLink.click();

    await page.waitForURL(/\/tools\/[^/]+$/u);
    const heading = page.getByRole('heading', { level: 2 }).first();
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();
  });

  /**
   * Tool/ToolUsage had zero e2e coverage of any kind before this
   * (pre-cutover-audit-ledger.md's "Trusted-lean bundle" audit, 2026-07-28 —
   * 3 "declared clean" domains turned out to just be unexamined). It also
   * shipped same-day P1s: TU-1/TU-2 (`tool-usage.drizzle.repository.ts`'s
   * hand-rolled container resolver, unlike the shared helper `create()` uses,
   * had no soft-delete liveness filter and only recognized 2 of 6 container
   * types) meant a single dead Project/Engagement container could null out
   * `containerSummary`/`usages` for EVERY tool that ever recorded a usage
   * against it, via non-null propagation. Fixed + runtime-verified
   * 2026-07-29. Recording a real usage and reading it back from the tool's
   * own detail page exercises exactly that container-resolution path, not
   * just the create/delete mutations in isolation.
   *
   * Self-created data only: the Autocomplete's `getOptionDisabled` already
   * guarantees whichever tool comes back first isn't already used on this
   * engagement, so this creates exactly one throwaway ToolUsage row and
   * deletes it via the same dialog's own affordance before the test ends —
   * nothing pre-existing is mutated or left behind.
   */
  test('recording a tool usage shows up on the tool detail page, and removing it clears both', async ({
    page,
  }) => {
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
    const engagementUrl = page.url();
    const main = page.getByRole('main');

    const toolsHeading = page.getByRole('heading', {
      name: 'Tools',
      exact: true,
    });
    await expect(toolsHeading).toBeVisible();
    await toolsHeading.locator('..').getByRole('button').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Manage Tools')).toBeVisible();

    await dialog.getByLabel('Tool').click();
    // `getOptionDisabled` greys out any tool already used on this
    // engagement — skip those rather than assume the first option is free.
    const option = page
      .locator('[role="option"]:not([aria-disabled="true"])')
      .first();
    await expect(option).toBeVisible();
    const toolName = (await option.textContent())?.trim();
    expect(
      toolName,
      'tool option had no text to read a name from'
    ).toBeTruthy();
    await option.click();

    await dialog.getByRole('button', { name: 'Add' }).click();

    const chipInDialog = dialog.getByRole('listitem').filter({
      hasText: toolName!,
    });
    await expect(chipInDialog).toBeVisible();

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible();

    // Confirm it's really persisted server-side, not just optimistic UI,
    // before checking the actual TU-1/TU-2 regression surface.
    await page.reload();
    await expect(
      page.getByText(toolName!, { exact: true }).first()
    ).toBeVisible();

    await page.goto('/tools');
    // Not `exact: true` — the mobile EntityList link's accessible name also
    // includes the tool's description text, not just its name.
    await main.getByRole('link', { name: toolName! }).click();
    await page.waitForURL(/\/tools\/[^/]+$/u);

    await expect(page.getByText('Something went wrong')).not.toBeVisible();
    // Mobile viewport: `TabList` collapses tabs into a `TextField select`
    // (see components/Tabs/TabList.tsx) rather than rendering role="tab"
    // elements directly — open it to see whether an Engagements/Projects
    // tab exists at all, which it only will if `containerSummary` picked up
    // the usage just recorded (the actual TU-1/TU-2 regression surface).
    await page.getByRole('combobox').click();
    await expect(
      page.getByRole('option', { name: /Engagements|Projects/u })
    ).toBeVisible();
    await page.keyboard.press('Escape');

    await page.goto(engagementUrl);

    await toolsHeading.locator('..').getByRole('button').click();
    const chipToDelete = dialog.getByRole('listitem').filter({
      hasText: toolName!,
    });
    await expect(chipToDelete).toBeVisible();
    await chipToDelete.locator('.MuiChip-deleteIcon').click();
    await expect(chipToDelete).not.toBeVisible();

    await dialog.getByRole('button', { name: 'Close' }).click();
    await page.reload();
    await expect(page.getByText(toolName!, { exact: true })).not.toBeVisible();
  });
});
