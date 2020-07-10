/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export type LanguageFormFragment = { __typename?: 'Language' } & Pick<
  Types.Language,
  'id'
> & {
    name: { __typename?: 'SecuredString' } & SsFragment;
    displayName: { __typename?: 'SecuredString' } & SsFragment;
    displayNamePronunciation: { __typename?: 'SecuredString' } & SsFragment;
    isDialect: { __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
      'value' | 'canRead' | 'canEdit'
    >;
    ethnologue: { __typename?: 'EthnologueLanguage' } & {
      id: { __typename?: 'SecuredString' } & SsFragment;
      name: { __typename?: 'SecuredString' } & SsFragment;
      code: { __typename?: 'SecuredString' } & SsFragment;
      provisionalCode: { __typename?: 'SecuredString' } & SsFragment;
      population: { __typename?: 'SecuredInt' } & Pick<
        Types.SecuredInt,
        'value' | 'canRead' | 'canEdit'
      >;
    };
    populationOverride: { __typename?: 'SecuredInt' } & Pick<
      Types.SecuredInt,
      'value' | 'canRead' | 'canEdit'
    >;
    registryOfDialectsCode: { __typename?: 'SecuredString' } & SsFragment;
    leastOfThese: { __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
      'value' | 'canRead' | 'canEdit'
    >;
    leastOfTheseReason: { __typename?: 'SecuredString' } & SsFragment;
  };

export type SsFragment = { __typename?: 'SecuredString' } & Pick<
  Types.SecuredString,
  'value' | 'canRead' | 'canEdit'
>;

export const SsFragmentDoc = gql`
  fragment ss on SecuredString {
    value
    canRead
    canEdit
  }
`;
export const LanguageFormFragmentDoc = gql`
  fragment LanguageForm on Language {
    id
    name {
      ...ss
    }
    displayName {
      ...ss
    }
    displayNamePronunciation {
      ...ss
    }
    isDialect {
      value
      canRead
      canEdit
    }
    ethnologue {
      id {
        ...ss
      }
      name {
        ...ss
      }
      code {
        ...ss
      }
      provisionalCode {
        ...ss
      }
      population {
        value
        canRead
        canEdit
      }
    }
    populationOverride {
      value
      canRead
      canEdit
    }
    registryOfDialectsCode {
      ...ss
    }
    leastOfThese {
      value
      canRead
      canEdit
    }
    leastOfTheseReason {
      ...ss
    }
  }
  ${SsFragmentDoc}
`;
