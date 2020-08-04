/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import type * as Types from '../../../api/schema.generated';

export type LanguageFormFragment = { readonly __typename?: 'Language' } & Pick<
  Types.Language,
  'id'
> & {
    readonly name: { readonly __typename?: 'SecuredString' } & SsFragment;
    readonly displayName: {
      readonly __typename?: 'SecuredString';
    } & SsFragment;
    readonly displayNamePronunciation: {
      readonly __typename?: 'SecuredString';
    } & SsFragment;
    readonly isDialect: { readonly __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
      'value' | 'canRead' | 'canEdit'
    >;
    readonly ethnologue: { readonly __typename?: 'EthnologueLanguage' } & {
      readonly id: { readonly __typename?: 'SecuredString' } & SsFragment;
      readonly name: { readonly __typename?: 'SecuredString' } & SsFragment;
      readonly code: { readonly __typename?: 'SecuredString' } & SsFragment;
      readonly provisionalCode: {
        readonly __typename?: 'SecuredString';
      } & SsFragment;
      readonly population: { readonly __typename?: 'SecuredInt' } & Pick<
        Types.SecuredInt,
        'value' | 'canRead' | 'canEdit'
      >;
    };
    readonly populationOverride: { readonly __typename?: 'SecuredInt' } & Pick<
      Types.SecuredInt,
      'value' | 'canRead' | 'canEdit'
    >;
    readonly registryOfDialectsCode: {
      readonly __typename?: 'SecuredString';
    } & SsFragment;
    readonly leastOfThese: { readonly __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
      'value' | 'canRead' | 'canEdit'
    >;
    readonly leastOfTheseReason: {
      readonly __typename?: 'SecuredString';
    } & SsFragment;
  };

export type SsFragment = { readonly __typename?: 'SecuredString' } & Pick<
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
