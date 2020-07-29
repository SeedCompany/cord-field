/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type MethodologiesCardFragment = {
  readonly __typename?: 'SecuredMethodologies';
} & Pick<Types.SecuredMethodologies, 'canRead' | 'canEdit' | 'value'>;

export const MethodologiesCardFragmentDoc = gql`
  fragment MethodologiesCard on SecuredMethodologies {
    canRead
    canEdit
    value
  }
`;
