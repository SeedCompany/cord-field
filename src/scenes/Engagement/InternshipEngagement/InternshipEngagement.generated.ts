/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export type InternshipEngagementDetailFragment = {
  __typename?: 'InternshipEngagement';
} & Pick<Types.InternshipEngagement, 'id' | 'createdAt'> & {
    intern: { __typename?: 'SecuredUser' } & Pick<
      Types.SecuredUser,
      'canRead' | 'canEdit'
    > & {
        value?: Types.Maybe<
          { __typename?: 'User' } & Pick<Types.User, 'fullName'>
        >;
      };
    startDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    endDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    completeDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    disbursementCompleteDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    communicationsCompleteDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
  };

export const InternshipEngagementDetailFragmentDoc = gql`
  fragment InternshipEngagementDetail on InternshipEngagement {
    id
    createdAt
    intern {
      value {
        fullName
      }
      canRead
      canEdit
    }
    startDate {
      value
      canRead
      canEdit
    }
    endDate {
      value
      canRead
      canEdit
    }
    completeDate {
      value
      canRead
      canEdit
    }
    disbursementCompleteDate {
      value
      canRead
      canEdit
    }
    communicationsCompleteDate {
      value
      canRead
      canEdit
    }
  }
`;
