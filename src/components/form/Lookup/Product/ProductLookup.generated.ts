/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../../api/schema.generated';

export type FilmLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface FilmLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | { readonly __typename?: 'TranslationProject' }
      | { readonly __typename?: 'InternshipProject' }
      | { readonly __typename?: 'User' }
      | ({ readonly __typename?: 'Film' } & FilmLookupItemFragment)
      | { readonly __typename?: 'Story' }
      | { readonly __typename?: 'LiteracyMaterial' }
      | { readonly __typename?: 'Song' }
    >;
  };
}

export type StoryLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface StoryLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | { readonly __typename?: 'TranslationProject' }
      | { readonly __typename?: 'InternshipProject' }
      | { readonly __typename?: 'User' }
      | { readonly __typename?: 'Film' }
      | ({ readonly __typename?: 'Story' } & StoryLookupItemFragment)
      | { readonly __typename?: 'LiteracyMaterial' }
      | { readonly __typename?: 'Song' }
    >;
  };
}

export type LiteracyMaterialLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface LiteracyMaterialLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | { readonly __typename?: 'TranslationProject' }
      | { readonly __typename?: 'InternshipProject' }
      | { readonly __typename?: 'User' }
      | { readonly __typename?: 'Film' }
      | { readonly __typename?: 'Story' }
      | ({
          readonly __typename?: 'LiteracyMaterial';
        } & LiteracyMaterialLookupItemFragment)
      | { readonly __typename?: 'Song' }
    >;
  };
}

export type SongLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface SongLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | { readonly __typename?: 'TranslationProject' }
      | { readonly __typename?: 'InternshipProject' }
      | { readonly __typename?: 'User' }
      | { readonly __typename?: 'Film' }
      | { readonly __typename?: 'Story' }
      | { readonly __typename?: 'LiteracyMaterial' }
      | ({ readonly __typename?: 'Song' } & SongLookupItemFragment)
    >;
  };
}

export type FilmLookupItemFragment = { readonly __typename?: 'Film' } & Pick<
  Types.Film,
  'id'
> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export type StoryLookupItemFragment = { readonly __typename?: 'Story' } & Pick<
  Types.Story,
  'id'
> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export type LiteracyMaterialLookupItemFragment = {
  readonly __typename?: 'LiteracyMaterial';
} & Pick<Types.LiteracyMaterial, 'id'> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export type SongLookupItemFragment = { readonly __typename?: 'Song' } & Pick<
  Types.Song,
  'id'
> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export const FilmLookupItemFragmentDoc = gql`
  fragment FilmLookupItem on Film {
    id
    name {
      value
    }
  }
`;
export const StoryLookupItemFragmentDoc = gql`
  fragment StoryLookupItem on Story {
    id
    name {
      value
    }
  }
`;
export const LiteracyMaterialLookupItemFragmentDoc = gql`
  fragment LiteracyMaterialLookupItem on LiteracyMaterial {
    id
    name {
      value
    }
  }
`;
export const SongLookupItemFragmentDoc = gql`
  fragment SongLookupItem on Song {
    id
    name {
      value
    }
  }
`;
export const FilmLookupDocument = gql`
  query FilmLookup($query: String!) {
    search(input: { query: $query, type: [Film] }) {
      items {
        ... on Film {
          ...FilmLookupItem
        }
      }
    }
  }
  ${FilmLookupItemFragmentDoc}
`;

/**
 * __useFilmLookupQuery__
 *
 * To run a query within a React component, call `useFilmLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useFilmLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilmLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useFilmLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    FilmLookupQuery,
    FilmLookupQueryVariables
  >
) {
  return Apollo.useQuery<FilmLookupQuery, FilmLookupQueryVariables>(
    FilmLookupDocument,
    baseOptions
  );
}
export function useFilmLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FilmLookupQuery,
    FilmLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<FilmLookupQuery, FilmLookupQueryVariables>(
    FilmLookupDocument,
    baseOptions
  );
}
export type FilmLookupQueryHookResult = ReturnType<typeof useFilmLookupQuery>;
export type FilmLookupLazyQueryHookResult = ReturnType<
  typeof useFilmLookupLazyQuery
>;
export type FilmLookupQueryResult = Apollo.QueryResult<
  FilmLookupQuery,
  FilmLookupQueryVariables
>;
export const StoryLookupDocument = gql`
  query StoryLookup($query: String!) {
    search(input: { query: $query, type: [Story] }) {
      items {
        ... on Story {
          ...StoryLookupItem
        }
      }
    }
  }
  ${StoryLookupItemFragmentDoc}
`;

/**
 * __useStoryLookupQuery__
 *
 * To run a query within a React component, call `useStoryLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useStoryLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStoryLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useStoryLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    StoryLookupQuery,
    StoryLookupQueryVariables
  >
) {
  return Apollo.useQuery<StoryLookupQuery, StoryLookupQueryVariables>(
    StoryLookupDocument,
    baseOptions
  );
}
export function useStoryLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    StoryLookupQuery,
    StoryLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<StoryLookupQuery, StoryLookupQueryVariables>(
    StoryLookupDocument,
    baseOptions
  );
}
export type StoryLookupQueryHookResult = ReturnType<typeof useStoryLookupQuery>;
export type StoryLookupLazyQueryHookResult = ReturnType<
  typeof useStoryLookupLazyQuery
>;
export type StoryLookupQueryResult = Apollo.QueryResult<
  StoryLookupQuery,
  StoryLookupQueryVariables
>;
export const LiteracyMaterialLookupDocument = gql`
  query LiteracyMaterialLookup($query: String!) {
    search(input: { query: $query, type: [LiteracyMaterial] }) {
      items {
        ... on LiteracyMaterial {
          ...LiteracyMaterialLookupItem
        }
      }
    }
  }
  ${LiteracyMaterialLookupItemFragmentDoc}
`;

/**
 * __useLiteracyMaterialLookupQuery__
 *
 * To run a query within a React component, call `useLiteracyMaterialLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useLiteracyMaterialLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLiteracyMaterialLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useLiteracyMaterialLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LiteracyMaterialLookupQuery,
    LiteracyMaterialLookupQueryVariables
  >
) {
  return Apollo.useQuery<
    LiteracyMaterialLookupQuery,
    LiteracyMaterialLookupQueryVariables
  >(LiteracyMaterialLookupDocument, baseOptions);
}
export function useLiteracyMaterialLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LiteracyMaterialLookupQuery,
    LiteracyMaterialLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    LiteracyMaterialLookupQuery,
    LiteracyMaterialLookupQueryVariables
  >(LiteracyMaterialLookupDocument, baseOptions);
}
export type LiteracyMaterialLookupQueryHookResult = ReturnType<
  typeof useLiteracyMaterialLookupQuery
>;
export type LiteracyMaterialLookupLazyQueryHookResult = ReturnType<
  typeof useLiteracyMaterialLookupLazyQuery
>;
export type LiteracyMaterialLookupQueryResult = Apollo.QueryResult<
  LiteracyMaterialLookupQuery,
  LiteracyMaterialLookupQueryVariables
>;
export const SongLookupDocument = gql`
  query SongLookup($query: String!) {
    search(input: { query: $query, type: [Song] }) {
      items {
        ... on Song {
          ...SongLookupItem
        }
      }
    }
  }
  ${SongLookupItemFragmentDoc}
`;

/**
 * __useSongLookupQuery__
 *
 * To run a query within a React component, call `useSongLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useSongLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSongLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSongLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SongLookupQuery,
    SongLookupQueryVariables
  >
) {
  return Apollo.useQuery<SongLookupQuery, SongLookupQueryVariables>(
    SongLookupDocument,
    baseOptions
  );
}
export function useSongLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SongLookupQuery,
    SongLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<SongLookupQuery, SongLookupQueryVariables>(
    SongLookupDocument,
    baseOptions
  );
}
export type SongLookupQueryHookResult = ReturnType<typeof useSongLookupQuery>;
export type SongLookupLazyQueryHookResult = ReturnType<
  typeof useSongLookupLazyQuery
>;
export type SongLookupQueryResult = Apollo.QueryResult<
  SongLookupQuery,
  SongLookupQueryVariables
>;
