/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type MethodologyCardFragment = {
  __typename?: 'InternshipEngagement';
} & {
  methodologies: { __typename?: 'SecuredMethodologies' } & Pick<
    Types.SecuredMethodologies,
    'canRead' | 'canEdit' | 'value'
  >;
};

export const MethodologyCardFragmentDoc = gql`
  fragment MethodologyCard on InternshipEngagement {
    methodologies {
      canRead
      canEdit
      value
    }
  }
`;
