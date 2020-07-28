/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../../api/schema.generated';

export type LeastOfTheseFragment = { __typename?: 'Language' } & {
  leastOfThese: { __typename?: 'SecuredBoolean' } & Pick<
    Types.SecuredBoolean,
    'canRead' | 'value'
  >;
  leastOfTheseReason: { __typename?: 'SecuredString' } & Pick<
    Types.SecuredString,
    'canRead' | 'value'
  >;
};

export const LeastOfTheseFragmentDoc = gql`
  fragment LeastOfThese on Language {
    leastOfThese {
      canRead
      value
    }
    leastOfTheseReason {
      canRead
      value
    }
  }
`;
