/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type PartnershipCardFragment = { __typename?: 'Partnership' } & Pick<
  Types.Partnership,
  'id' | 'createdAt'
> & {
    types: { __typename?: 'SecuredPartnershipTypes' } & Pick<
      Types.SecuredPartnershipTypes,
      'value'
    >;
    agreementStatus: {
      __typename?: 'SecuredPartnershipAgreementStatus';
    } & Pick<Types.SecuredPartnershipAgreementStatus, 'value'>;
    mouStatus: { __typename?: 'SecuredPartnershipAgreementStatus' } & Pick<
      Types.SecuredPartnershipAgreementStatus,
      'value'
    >;
    organization: { __typename?: 'Organization' } & {
      name: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value'
      >;
    };
  };

export const PartnershipCardFragmentDoc = gql`
  fragment PartnershipCard on Partnership {
    id
    createdAt
    types {
      value
    }
    agreementStatus {
      value
    }
    mouStatus {
      value
    }
    organization {
      name {
        value
      }
    }
  }
`;
