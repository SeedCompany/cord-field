/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import gql from 'graphql-tag';
import { PartnershipItemFragment } from './PartnershpItem.generated';
import { PartnershipItemFragmentDoc } from './PartnershpItem.generated';

export type PartnershipSummaryFragment = {
  __typename?: 'SecuredPartnershipList';
} & { items: Array<{ __typename?: 'Partnership' } & PartnershipItemFragment> };

export const PartnershipSummaryFragmentDoc = gql`
  fragment PartnershipSummary on SecuredPartnershipList {
    items {
      ...PartnershipItem
    }
  }
  ${PartnershipItemFragmentDoc}
`;
