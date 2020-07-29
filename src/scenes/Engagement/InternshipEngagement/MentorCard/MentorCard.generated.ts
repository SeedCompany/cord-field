/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../../api/schema.generated';
import { UserListItemFragment } from '../../../../components/UserListItemCard/UserListItem.generated';
import { UserListItemFragmentDoc } from '../../../../components/UserListItemCard/UserListItem.generated';

export type MentorCardFragment = { readonly __typename?: 'SecuredUser' } & Pick<
  Types.SecuredUser,
  'canRead' | 'canEdit'
> & {
    readonly value?: Types.Maybe<
      { readonly __typename?: 'User' } & UserListItemFragment
    >;
  };

export const MentorCardFragmentDoc = gql`
  fragment MentorCard on SecuredUser {
    canRead
    canEdit
    value {
      ...UserListItem
    }
  }
  ${UserListItemFragmentDoc}
`;
