/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../../api/schema.generated';

export type ProjectLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface ProjectLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | ({
          readonly __typename?: 'TranslationProject';
        } & ProjectLookupItem_TranslationProject_Fragment)
      | ({
          readonly __typename?: 'InternshipProject';
        } & ProjectLookupItem_InternshipProject_Fragment)
      | { readonly __typename?: 'User' }
      | { readonly __typename?: 'Film' }
      | { readonly __typename?: 'Story' }
      | { readonly __typename?: 'LiteracyMaterial' }
      | { readonly __typename?: 'Song' }
    >;
  };
}

export type TranslationProjectLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface TranslationProjectLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | ({
          readonly __typename?: 'TranslationProject';
        } & TranslationProjectLookupItemFragment)
      | { readonly __typename?: 'InternshipProject' }
      | { readonly __typename?: 'User' }
      | { readonly __typename?: 'Film' }
      | { readonly __typename?: 'Story' }
      | { readonly __typename?: 'LiteracyMaterial' }
      | { readonly __typename?: 'Song' }
    >;
  };
}

export type InternshipProjectLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface InternshipProjectLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | { readonly __typename?: 'TranslationProject' }
      | ({
          readonly __typename?: 'InternshipProject';
        } & InternshipProjectLookupItemFragment)
      | { readonly __typename?: 'User' }
      | { readonly __typename?: 'Film' }
      | { readonly __typename?: 'Story' }
      | { readonly __typename?: 'LiteracyMaterial' }
      | { readonly __typename?: 'Song' }
    >;
  };
}

export type ProjectLookupItem_TranslationProject_Fragment = {
  readonly __typename?: 'TranslationProject';
} & Pick<Types.TranslationProject, 'id'> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export type ProjectLookupItem_InternshipProject_Fragment = {
  readonly __typename?: 'InternshipProject';
} & Pick<Types.InternshipProject, 'id'> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export type ProjectLookupItemFragment =
  | ProjectLookupItem_TranslationProject_Fragment
  | ProjectLookupItem_InternshipProject_Fragment;

export type TranslationProjectLookupItemFragment = {
  readonly __typename?: 'TranslationProject';
} & Pick<Types.TranslationProject, 'id'> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export type InternshipProjectLookupItemFragment = {
  readonly __typename?: 'InternshipProject';
} & Pick<Types.InternshipProject, 'id'> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export const ProjectLookupItemFragmentDoc = gql`
  fragment ProjectLookupItem on Project {
    id
    name {
      value
    }
  }
`;
export const TranslationProjectLookupItemFragmentDoc = gql`
  fragment TranslationProjectLookupItem on TranslationProject {
    id
    name {
      value
    }
  }
`;
export const InternshipProjectLookupItemFragmentDoc = gql`
  fragment InternshipProjectLookupItem on InternshipProject {
    id
    name {
      value
    }
  }
`;
export const ProjectLookupDocument = gql`
  query ProjectLookup($query: String!) {
    search(
      input: { query: $query, type: [TranslationProject, InternshipProject] }
    ) {
      items {
        ... on Project {
          ...ProjectLookupItem
        }
      }
    }
  }
  ${ProjectLookupItemFragmentDoc}
`;

/**
 * __useProjectLookupQuery__
 *
 * To run a query within a React component, call `useProjectLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useProjectLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ProjectLookupQuery,
    ProjectLookupQueryVariables
  >
) {
  return Apollo.useQuery<ProjectLookupQuery, ProjectLookupQueryVariables>(
    ProjectLookupDocument,
    baseOptions
  );
}
export function useProjectLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProjectLookupQuery,
    ProjectLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<ProjectLookupQuery, ProjectLookupQueryVariables>(
    ProjectLookupDocument,
    baseOptions
  );
}
export type ProjectLookupQueryHookResult = ReturnType<
  typeof useProjectLookupQuery
>;
export type ProjectLookupLazyQueryHookResult = ReturnType<
  typeof useProjectLookupLazyQuery
>;
export type ProjectLookupQueryResult = Apollo.QueryResult<
  ProjectLookupQuery,
  ProjectLookupQueryVariables
>;
export const TranslationProjectLookupDocument = gql`
  query TranslationProjectLookup($query: String!) {
    search(input: { query: $query, type: [TranslationProject] }) {
      items {
        ... on TranslationProject {
          ...TranslationProjectLookupItem
        }
      }
    }
  }
  ${TranslationProjectLookupItemFragmentDoc}
`;

/**
 * __useTranslationProjectLookupQuery__
 *
 * To run a query within a React component, call `useTranslationProjectLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useTranslationProjectLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTranslationProjectLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useTranslationProjectLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    TranslationProjectLookupQuery,
    TranslationProjectLookupQueryVariables
  >
) {
  return Apollo.useQuery<
    TranslationProjectLookupQuery,
    TranslationProjectLookupQueryVariables
  >(TranslationProjectLookupDocument, baseOptions);
}
export function useTranslationProjectLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TranslationProjectLookupQuery,
    TranslationProjectLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    TranslationProjectLookupQuery,
    TranslationProjectLookupQueryVariables
  >(TranslationProjectLookupDocument, baseOptions);
}
export type TranslationProjectLookupQueryHookResult = ReturnType<
  typeof useTranslationProjectLookupQuery
>;
export type TranslationProjectLookupLazyQueryHookResult = ReturnType<
  typeof useTranslationProjectLookupLazyQuery
>;
export type TranslationProjectLookupQueryResult = Apollo.QueryResult<
  TranslationProjectLookupQuery,
  TranslationProjectLookupQueryVariables
>;
export const InternshipProjectLookupDocument = gql`
  query InternshipProjectLookup($query: String!) {
    search(input: { query: $query, type: [InternshipProject] }) {
      items {
        ... on InternshipProject {
          ...InternshipProjectLookupItem
        }
      }
    }
  }
  ${InternshipProjectLookupItemFragmentDoc}
`;

/**
 * __useInternshipProjectLookupQuery__
 *
 * To run a query within a React component, call `useInternshipProjectLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useInternshipProjectLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInternshipProjectLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useInternshipProjectLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    InternshipProjectLookupQuery,
    InternshipProjectLookupQueryVariables
  >
) {
  return Apollo.useQuery<
    InternshipProjectLookupQuery,
    InternshipProjectLookupQueryVariables
  >(InternshipProjectLookupDocument, baseOptions);
}
export function useInternshipProjectLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    InternshipProjectLookupQuery,
    InternshipProjectLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    InternshipProjectLookupQuery,
    InternshipProjectLookupQueryVariables
  >(InternshipProjectLookupDocument, baseOptions);
}
export type InternshipProjectLookupQueryHookResult = ReturnType<
  typeof useInternshipProjectLookupQuery
>;
export type InternshipProjectLookupLazyQueryHookResult = ReturnType<
  typeof useInternshipProjectLookupLazyQuery
>;
export type InternshipProjectLookupQueryResult = Apollo.QueryResult<
  InternshipProjectLookupQuery,
  InternshipProjectLookupQueryVariables
>;
