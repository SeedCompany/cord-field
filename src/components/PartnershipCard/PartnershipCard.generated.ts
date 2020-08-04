/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import type * as Types from '../../api/schema.generated';

export type PartnershipCardFragment = {
  readonly __typename?: 'Partnership';
} & Pick<Types.Partnership, 'id' | 'createdAt'> & {
    readonly types: { readonly __typename?: 'SecuredPartnershipTypes' } & Pick<
      Types.SecuredPartnershipTypes,
      'value'
    >;
    readonly agreementStatus: {
      readonly __typename?: 'SecuredPartnershipAgreementStatus';
    } & Pick<Types.SecuredPartnershipAgreementStatus, 'value'>;
    readonly mouStatus: {
      readonly __typename?: 'SecuredPartnershipAgreementStatus';
    } & Pick<Types.SecuredPartnershipAgreementStatus, 'value'>;
    readonly organization: { readonly __typename?: 'Organization' } & {
      readonly name: { readonly __typename?: 'SecuredString' } & Pick<
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
