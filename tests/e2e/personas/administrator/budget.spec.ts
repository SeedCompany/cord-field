import { join } from 'node:path';
import { API_BASE } from '../../support/graphql';
import { expect, test } from '../../support/test';

const FIXTURES = join(__dirname, '../../fixtures');

/**
 * Round 8 (final sweep) of the comprehensive-coverage push: the Project
 * Budget page. `ProjectBudget` (an `@live` query) fires on any project's
 * Budget tab; `UpdateProjectBudgetUniversalTemplate` is a real, standalone
 * `CreateDefinedFileVersion` upload attached to the Budget entity itself
 * (confirmed via source — `ProjectBudget.graphql`'s own mutation, not a
 * disguised file download), rendered through the same generic
 * `DefinedFileCard` used everywhere else in this suite.
 *
 * `UpdateProjectBudgetRecord` is deliberately NOT covered here — Round 8
 * couldn't trigger `BudgetRecord` generation (a `Managing`-type partnership
 * with `financialReportingTypes` granted plus real project dates left
 * `budget.records` empty). Round 9 root-caused it: the sync hook gates on
 * `Funding` in the partnership's `types`, a different value than `Managing`.
 * See product-progress-and-budget.spec.ts for the working recipe and
 * budget-derivation.spec.ts (Round 11) for the fiscal-year math assertions.
 */
test.describe('project budget (administrator)', () => {
  test("a project's budget page loads, and its Universal Template can be uploaded", async ({
    page,
  }) => {
    const lookupRes = await page.request.post(`${API_BASE}/graphql`, {
      data: {
        query:
          'query { projects(input:{filter:{name:"Playwright Seed Project"},count:1}) { items { id } } }',
      },
    });
    const projectId = (await lookupRes.json())?.data?.projects?.items?.[0]?.id;
    expect(
      projectId,
      'expected the seeded fixture project to exist'
    ).toBeTruthy();

    // `@live` queries ride a `text/event-stream` response that never
    // "completes" while the connection is open — `.json()` on one throws
    // (established in `support/test.ts`'s own coverage tracker). Just
    // confirm the request fires; the page-level assertions below cover
    // whether it actually rendered without error.
    await Promise.all([
      page.waitForResponse((res) =>
        res.url().includes('/graphql/ProjectBudget')
      ),
      page.goto(`/projects/${projectId}/budget`),
    ]);
    await expect(
      page.getByRole('heading', { name: 'Budget', exact: true })
    ).toBeVisible();
    await expect(page.getByText('Something went wrong')).not.toBeVisible();

    const uploadInput = page.locator(
      'input[name="defined_file_version_uploader"]'
    );
    const [uploadResponse] = await Promise.all([
      page.waitForResponse(async (res) => {
        if (
          !res.url().includes('/graphql/UpdateProjectBudgetUniversalTemplate')
        )
          return false;
        const body = await res.json().catch(() => null);
        return !(
          body?.errors?.length === 1 &&
          body.errors[0]?.message === 'PersistedQueryNotFound'
        );
      }),
      uploadInput.setInputFiles(join(FIXTURES, 'tiny.txt')),
    ]);
    expect(
      (await uploadResponse.json())?.errors,
      'expected the Universal Template upload to succeed'
    ).toBeFalsy();
    await expect(page.locator('#root').getByText('tiny.txt')).toBeVisible();
  });
});
