/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export type InternshipEngagementDetailFragment = {
  __typename?: 'InternshipEngagement';
} & Pick<Types.InternshipEngagement, 'id' | 'createdAt'>;

export const InternshipEngagementDetailFragmentDoc = gql`
  fragment InternshipEngagementDetail on InternshipEngagement {
    id
    createdAt
  }
`;
