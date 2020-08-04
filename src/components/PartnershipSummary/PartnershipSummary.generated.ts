/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import type * as Types from '../../api/schema.generated';
import type { PartnershipItemFragment } from './PartnershpItem.generated';
import { PartnershipItemFragmentDoc } from './PartnershpItem.generated';

export type PartnershipSummaryFragment = {
  readonly __typename?: 'SecuredPartnershipList';
} & Pick<Types.SecuredPartnershipList, 'total'> & {
    readonly items: ReadonlyArray<
      { readonly __typename?: 'Partnership' } & PartnershipItemFragment
    >;
  };

export const PartnershipSummaryFragmentDoc = gql`
  fragment PartnershipSummary on SecuredPartnershipList {
    total
    items {
      ...PartnershipItem
    }
  }
  ${PartnershipItemFragmentDoc}
`;
