import { expect, Page } from '@playwright/test';
import { gql } from './graphql';

/**
 * The seeded fixture partner is identified by its organization name prefix.
 * cord-api-v3's seed generates the rest of the name with a random suffix, so
 * only the prefix is stable.
 */
const SEEDED_PARTNER_ORG_PREFIX = 'Trantow';

interface PartnerSearchItem {
  id?: string;
  organization?: { value?: { name?: { value?: string } | null } | null } | null;
}

/**
 * Find the seeded fixture partner's id.
 *
 * Uses search rather than `partners(input:{count:2})` + `.find()`: there are
 * hundreds of partners and throwaway ones leak into the first page, so a
 * two-row window found the fixture only by luck and failed as soon as
 * anything sorted ahead of it.
 *
 * Every hop is optional-chained — `organization.value` is null whenever the
 * viewer can't read it or the org was soft-deleted, and dereferencing it
 * threw a raw TypeError instead of producing this assertion's message.
 */
export const findSeededPartnerId = async (page: Page) => {
  const res = await gql(
    page,
    `query { search(input:{query:"${SEEDED_PARTNER_ORG_PREFIX}", type:[Partner]}) {
       items { __typename ... on Partner { id organization { value { name { value } } } } }
     } }`
  );
  const items: PartnerSearchItem[] = res?.data?.search?.items ?? [];
  const partner = items.find((p) =>
    p.organization?.value?.name?.value?.startsWith(SEEDED_PARTNER_ORG_PREFIX)
  );
  expect(
    partner?.id,
    `expected a seeded partner whose organization name starts with "${SEEDED_PARTNER_ORG_PREFIX}"`
  ).toBeTruthy();
  return partner!.id!;
};
