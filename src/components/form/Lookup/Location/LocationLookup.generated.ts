/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type {
  DisplayCountryFragment,
  DisplayRegionFragment,
  DisplayZoneFragment,
} from '../../../../api/fragments/location.generated';
import {
  DisplayCountryFragmentDoc,
  DisplayRegionFragmentDoc,
  DisplayZoneFragmentDoc,
} from '../../../../api/fragments/location.generated';
import type * as Types from '../../../../api/schema.generated';

export type CountryLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface CountryLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | ({ readonly __typename?: 'Country' } & DisplayCountryFragment)
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | { readonly __typename?: 'TranslationProject' }
      | { readonly __typename?: 'InternshipProject' }
      | { readonly __typename?: 'User' }
      | { readonly __typename?: 'Film' }
      | { readonly __typename?: 'Story' }
      | { readonly __typename?: 'LiteracyMaterial' }
      | { readonly __typename?: 'Song' }
    >;
  };
}

export type RegionLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface RegionLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | ({ readonly __typename?: 'Region' } & DisplayRegionFragment)
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | { readonly __typename?: 'TranslationProject' }
      | { readonly __typename?: 'InternshipProject' }
      | { readonly __typename?: 'User' }
      | { readonly __typename?: 'Film' }
      | { readonly __typename?: 'Story' }
      | { readonly __typename?: 'LiteracyMaterial' }
      | { readonly __typename?: 'Song' }
    >;
  };
}

export type ZoneLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface ZoneLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | ({ readonly __typename?: 'Zone' } & DisplayZoneFragment)
      | { readonly __typename?: 'Language' }
      | { readonly __typename?: 'TranslationProject' }
      | { readonly __typename?: 'InternshipProject' }
      | { readonly __typename?: 'User' }
      | { readonly __typename?: 'Film' }
      | { readonly __typename?: 'Story' }
      | { readonly __typename?: 'LiteracyMaterial' }
      | { readonly __typename?: 'Song' }
    >;
  };
}

export const CountryLookupDocument = gql`
  query CountryLookup($query: String!) {
    search(input: { query: $query, type: [Country] }) {
      items {
        ...DisplayCountry
      }
    }
  }
  ${DisplayCountryFragmentDoc}
`;

/**
 * __useCountryLookupQuery__
 *
 * To run a query within a React component, call `useCountryLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountryLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountryLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useCountryLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CountryLookupQuery,
    CountryLookupQueryVariables
  >
) {
  return Apollo.useQuery<CountryLookupQuery, CountryLookupQueryVariables>(
    CountryLookupDocument,
    baseOptions
  );
}
export function useCountryLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CountryLookupQuery,
    CountryLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<CountryLookupQuery, CountryLookupQueryVariables>(
    CountryLookupDocument,
    baseOptions
  );
}
export type CountryLookupQueryHookResult = ReturnType<
  typeof useCountryLookupQuery
>;
export type CountryLookupLazyQueryHookResult = ReturnType<
  typeof useCountryLookupLazyQuery
>;
export type CountryLookupQueryResult = Apollo.QueryResult<
  CountryLookupQuery,
  CountryLookupQueryVariables
>;
export const RegionLookupDocument = gql`
  query RegionLookup($query: String!) {
    search(input: { query: $query, type: [Region] }) {
      items {
        ...DisplayRegion
      }
    }
  }
  ${DisplayRegionFragmentDoc}
`;

/**
 * __useRegionLookupQuery__
 *
 * To run a query within a React component, call `useRegionLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useRegionLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRegionLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useRegionLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    RegionLookupQuery,
    RegionLookupQueryVariables
  >
) {
  return Apollo.useQuery<RegionLookupQuery, RegionLookupQueryVariables>(
    RegionLookupDocument,
    baseOptions
  );
}
export function useRegionLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    RegionLookupQuery,
    RegionLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<RegionLookupQuery, RegionLookupQueryVariables>(
    RegionLookupDocument,
    baseOptions
  );
}
export type RegionLookupQueryHookResult = ReturnType<
  typeof useRegionLookupQuery
>;
export type RegionLookupLazyQueryHookResult = ReturnType<
  typeof useRegionLookupLazyQuery
>;
export type RegionLookupQueryResult = Apollo.QueryResult<
  RegionLookupQuery,
  RegionLookupQueryVariables
>;
export const ZoneLookupDocument = gql`
  query ZoneLookup($query: String!) {
    search(input: { query: $query, type: [Zone] }) {
      items {
        ...DisplayZone
      }
    }
  }
  ${DisplayZoneFragmentDoc}
`;

/**
 * __useZoneLookupQuery__
 *
 * To run a query within a React component, call `useZoneLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useZoneLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useZoneLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useZoneLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ZoneLookupQuery,
    ZoneLookupQueryVariables
  >
) {
  return Apollo.useQuery<ZoneLookupQuery, ZoneLookupQueryVariables>(
    ZoneLookupDocument,
    baseOptions
  );
}
export function useZoneLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ZoneLookupQuery,
    ZoneLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<ZoneLookupQuery, ZoneLookupQueryVariables>(
    ZoneLookupDocument,
    baseOptions
  );
}
export type ZoneLookupQueryHookResult = ReturnType<typeof useZoneLookupQuery>;
export type ZoneLookupLazyQueryHookResult = ReturnType<
  typeof useZoneLookupLazyQuery
>;
export type ZoneLookupQueryResult = Apollo.QueryResult<
  ZoneLookupQuery,
  ZoneLookupQueryVariables
>;
