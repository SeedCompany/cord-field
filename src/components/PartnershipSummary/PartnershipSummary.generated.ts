/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';
import { PartnershipItemFragment } from './PartnershpItem.generated';
import { PartnershipItemFragmentDoc } from './PartnershpItem.generated';

export type PartnershipSummaryFragment = {
  __typename?: 'SecuredPartnershipList';
} & Pick<Types.SecuredPartnershipList, 'total'> & {
    items: Array<{ __typename?: 'Partnership' } & PartnershipItemFragment>;
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
