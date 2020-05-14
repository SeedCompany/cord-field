/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type LanguageListItemFragment = { __typename?: 'Language' } & Pick<
  Types.Language,
  'id'
> & {
    name: { __typename?: 'SecuredString' } & Pick<Types.SecuredString, 'value'>;
    displayName: { __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    ethnologueName?: Types.Maybe<
      { __typename?: 'SecuredString' } & Pick<Types.SecuredString, 'value'>
    >;
    rodNumber?: Types.Maybe<
      { __typename?: 'SecuredInt' } & Pick<Types.SecuredInt, 'value'>
    >;
    organizationPopulation?: Types.Maybe<
      { __typename?: 'SecuredInt' } & Pick<Types.SecuredInt, 'value'>
    >;
    ethnologuePopulation?: Types.Maybe<
      { __typename?: 'SecuredInt' } & Pick<Types.SecuredInt, 'value'>
    >;
  };

export const LanguageListItemFragmentDoc = gql`
  fragment LanguageListItem on Language {
    id
    name {
      value
    }
    displayName {
      value
    }
    ethnologueName {
      value
    }
    rodNumber {
      value
    }
    organizationPopulation {
      value
    }
    ethnologuePopulation {
      value
    }
  }
`;
