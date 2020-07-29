/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type PartnershipItemFragment = {
  readonly __typename?: 'Partnership';
} & Pick<Types.Partnership, 'id'> & {
    readonly organization: { readonly __typename?: 'Organization' } & Pick<
      Types.Organization,
      'id' | 'avatarLetters'
    > & {
        readonly name: { readonly __typename?: 'SecuredString' } & Pick<
          Types.SecuredString,
          'value'
        >;
      };
  };

export const PartnershipItemFragmentDoc = gql`
  fragment PartnershipItem on Partnership {
    id
    organization {
      id
      name {
        value
      }
      avatarLetters
    }
  }
`;
