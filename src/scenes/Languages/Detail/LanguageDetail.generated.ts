/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import type * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import type {
  DisplayLocation_Country_Fragment,
  DisplayLocation_Region_Fragment,
  DisplayLocation_Zone_Fragment,
} from '../../../api/fragments/location.generated';
import { DisplayLocationFragmentDoc } from '../../../api/fragments/location.generated';
import type * as Types from '../../../api/schema.generated';
import type {
  ProjectListItem_InternshipProject_Fragment,
  ProjectListItem_TranslationProject_Fragment,
} from '../../../components/ProjectListItemCard/ProjectListItem.generated';
import { ProjectListItemFragmentDoc } from '../../../components/ProjectListItemCard/ProjectListItem.generated';
import type { SsFragment } from '../../Users/UserForm/UserForm.generated';
import { SsFragmentDoc } from '../../Users/UserForm/UserForm.generated';
import type { LanguageFormFragment } from '../LanguageForm/LangugeForm.generated';
import { LanguageFormFragmentDoc } from '../LanguageForm/LangugeForm.generated';
import type { LeastOfTheseFragment } from './LeastOfThese/LeastOfThese.generated';
import { LeastOfTheseFragmentDoc } from './LeastOfThese/LeastOfThese.generated';

export type LanguageQueryVariables = Types.Exact<{
  languageId: Types.Scalars['ID'];
}>;

export interface LanguageQuery {
  readonly language: {
    readonly __typename?: 'Language';
  } & LanguageDetailFragment &
    LanguageFormFragment;
}

export type LanguageDetailFragment = {
  readonly __typename?: 'Language';
} & Pick<
  Types.Language,
  'id' | 'createdAt' | 'sensitivity' | 'avatarLetters'
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
      'canRead' | 'canEdit' | 'value'
    >;
    readonly ethnologue: { readonly __typename?: 'EthnologueLanguage' } & {
      readonly id: { readonly __typename?: 'SecuredString' } & SsFragment;
      readonly code: { readonly __typename?: 'SecuredString' } & SsFragment;
      readonly provisionalCode: {
        readonly __typename?: 'SecuredString';
      } & SsFragment;
      readonly name: { readonly __typename?: 'SecuredString' } & SsFragment;
    };
    readonly registryOfDialectsCode: {
      readonly __typename?: 'SecuredString';
    } & SsFragment;
    readonly sponsorDate: { readonly __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'canRead' | 'canEdit' | 'value'
    >;
    readonly beginFiscalYear: { readonly __typename?: 'SecuredInt' } & Pick<
      Types.SecuredInt,
      'canRead' | 'canEdit' | 'value'
    >;
    readonly population: { readonly __typename?: 'SecuredInt' } & Pick<
      Types.SecuredInt,
      'canRead' | 'canEdit' | 'value'
    >;
    readonly locations: { readonly __typename?: 'SecuredLocationList' } & Pick<
      Types.SecuredLocationList,
      'canRead' | 'canCreate'
    > & {
        readonly items: ReadonlyArray<
          | ({
              readonly __typename?: 'Country';
            } & DisplayLocation_Country_Fragment)
          | ({
              readonly __typename?: 'Region';
            } & DisplayLocation_Region_Fragment)
          | ({ readonly __typename?: 'Zone' } & DisplayLocation_Zone_Fragment)
        >;
      };
    readonly projects: { readonly __typename?: 'SecuredProjectList' } & Pick<
      Types.SecuredProjectList,
      'canRead' | 'canCreate'
    > & {
        readonly items: ReadonlyArray<
          | ({
              readonly __typename?: 'TranslationProject';
            } & ProjectListItem_TranslationProject_Fragment)
          | ({
              readonly __typename?: 'InternshipProject';
            } & ProjectListItem_InternshipProject_Fragment)
        >;
      };
  } & LeastOfTheseFragment;

export const LanguageDetailFragmentDoc = gql`
  fragment LanguageDetail on Language {
    id
    createdAt
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
      canRead
      canEdit
      value
    }
    ...LeastOfThese
    ethnologue {
      id {
        ...ss
      }
      code {
        ...ss
      }
      provisionalCode {
        ...ss
      }
      name {
        ...ss
      }
    }
    registryOfDialectsCode {
      ...ss
    }
    sponsorDate {
      canRead
      canEdit
      value
    }
    sensitivity
    avatarLetters
    beginFiscalYear {
      canRead
      canEdit
      value
    }
    population {
      canRead
      canEdit
      value
    }
    locations {
      canRead
      canCreate
      items {
        ...DisplayLocation
      }
    }
    projects {
      canRead
      canCreate
      items {
        ...ProjectListItem
      }
    }
  }
  ${SsFragmentDoc}
  ${LeastOfTheseFragmentDoc}
  ${DisplayLocationFragmentDoc}
  ${ProjectListItemFragmentDoc}
`;
export const LanguageDocument = gql`
  query Language($languageId: ID!) {
    language(id: $languageId) {
      ...LanguageDetail
      ...LanguageForm
    }
  }
  ${LanguageDetailFragmentDoc}
  ${LanguageFormFragmentDoc}
`;

/**
 * __useLanguageQuery__
 *
 * To run a query within a React component, call `useLanguageQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguageQuery({
 *   variables: {
 *      languageId: // value for 'languageId'
 *   },
 * });
 */
export function useLanguageQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LanguageQuery,
    LanguageQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<LanguageQuery, LanguageQueryVariables>(
    LanguageDocument,
    baseOptions
  );
}
export function useLanguageLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LanguageQuery,
    LanguageQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<LanguageQuery, LanguageQueryVariables>(
    LanguageDocument,
    baseOptions
  );
}
export type LanguageQueryHookResult = ReturnType<typeof useLanguageQuery>;
export type LanguageLazyQueryHookResult = ReturnType<
  typeof useLanguageLazyQuery
>;
export type LanguageQueryResult = ApolloReactCommon.QueryResult<
  LanguageQuery,
  LanguageQueryVariables
>;
