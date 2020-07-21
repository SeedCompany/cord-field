/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import {
  DisplayLocation_Country_Fragment,
  DisplayLocation_Region_Fragment,
  DisplayLocation_Zone_Fragment,
} from '../../../api/fragments/location.generated';
import { DisplayLocationFragmentDoc } from '../../../api/fragments/location.generated';
import * as Types from '../../../api/schema.generated';
import {
  ProjectListItem_InternshipProject_Fragment,
  ProjectListItem_TranslationProject_Fragment,
} from '../../../components/ProjectListItemCard/ProjectListItem.generated';
import { ProjectListItemFragmentDoc } from '../../../components/ProjectListItemCard/ProjectListItem.generated';
import { SsFragment } from '../../Users/UserForm/UserForm.generated';
import { SsFragmentDoc } from '../../Users/UserForm/UserForm.generated';
import { LanguageFormFragment } from '../LanguageForm/LangugeForm.generated';
import { LanguageFormFragmentDoc } from '../LanguageForm/LangugeForm.generated';

export interface LanguageQueryVariables {
  languageId: Types.Scalars['ID'];
}

export type LanguageQuery = { __typename?: 'Query' } & {
  language: { __typename?: 'Language' } & LanguageDetailFragment &
    LanguageFormFragment;
};

export type LanguageDetailFragment = { __typename?: 'Language' } & Pick<
  Types.Language,
  'id' | 'createdAt' | 'sensitivity' | 'avatarLetters'
> & {
    name: { __typename?: 'SecuredString' } & SsFragment;
    displayName: { __typename?: 'SecuredString' } & SsFragment;
    displayNamePronunciation: { __typename?: 'SecuredString' } & SsFragment;
    isDialect: { __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
      'canRead' | 'canEdit' | 'value'
    >;
    ethnologue: { __typename?: 'EthnologueLanguage' } & {
      id: { __typename?: 'SecuredString' } & SsFragment;
      code: { __typename?: 'SecuredString' } & SsFragment;
      provisionalCode: { __typename?: 'SecuredString' } & SsFragment;
      name: { __typename?: 'SecuredString' } & SsFragment;
    };
    registryOfDialectsCode: { __typename?: 'SecuredString' } & SsFragment;
    sponsorDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'canRead' | 'canEdit' | 'value'
    >;
    beginFiscalYear: { __typename?: 'SecuredInt' } & Pick<
      Types.SecuredInt,
      'canRead' | 'canEdit' | 'value'
    >;
    population: { __typename?: 'SecuredInt' } & Pick<
      Types.SecuredInt,
      'canRead' | 'canEdit' | 'value'
    >;
    locations: { __typename?: 'SecuredLocationList' } & Pick<
      Types.SecuredLocationList,
      'canRead' | 'canCreate'
    > & {
        items: Array<
          | ({ __typename?: 'Country' } & DisplayLocation_Country_Fragment)
          | ({ __typename?: 'Region' } & DisplayLocation_Region_Fragment)
          | ({ __typename?: 'Zone' } & DisplayLocation_Zone_Fragment)
        >;
      };
    projects: { __typename?: 'SecuredProjectList' } & Pick<
      Types.SecuredProjectList,
      'canRead' | 'canCreate'
    > & {
        items: Array<
          | ({
              __typename?: 'TranslationProject';
            } & ProjectListItem_TranslationProject_Fragment)
          | ({
              __typename?: 'InternshipProject';
            } & ProjectListItem_InternshipProject_Fragment)
        >;
      };
  };

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
