/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type MentorCardFragment = { __typename?: 'User' } & Pick<
  Types.User,
  'fullName'
> & {
    organizations: { __typename?: 'SecuredOrganizationList' } & {
      items: Array<
        { __typename?: 'Organization' } & {
          name: { __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'value'
          >;
        }
      >;
    };
  };

export const MentorCardFragmentDoc = gql`
  fragment MentorCard on User {
    fullName
    organizations {
      items {
        name {
          value
        }
      }
    }
  }
`;
