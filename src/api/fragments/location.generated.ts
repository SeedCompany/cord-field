/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../schema.generated';

export type DisplayLocation_Country_Fragment = {
  readonly __typename?: 'Country';
} & DisplayCountryFragment;

export type DisplayLocation_Region_Fragment = {
  readonly __typename?: 'Region';
} & DisplayRegionFragment;

export type DisplayLocation_Zone_Fragment = {
  readonly __typename?: 'Zone';
} & DisplayZoneFragment;

export type DisplayLocationFragment =
  | DisplayLocation_Country_Fragment
  | DisplayLocation_Region_Fragment
  | DisplayLocation_Zone_Fragment;

export type DisplayCountryFragment = { readonly __typename?: 'Country' } & {
  readonly region: { readonly __typename?: 'SecuredRegion' } & {
    readonly value?: Types.Maybe<
      { readonly __typename?: 'Region' } & DisplayRegionFragment
    >;
  };
} & DisplayPlace_Country_Fragment;

export type DisplayRegionFragment = { readonly __typename?: 'Region' } & {
  readonly zone: { readonly __typename?: 'SecuredZone' } & {
    readonly value?: Types.Maybe<
      { readonly __typename?: 'Zone' } & DisplayPlace_Zone_Fragment
    >;
  };
} & DisplayPlace_Region_Fragment;

export type DisplayZoneFragment = {
  readonly __typename?: 'Zone';
} & DisplayPlace_Zone_Fragment;

export type DisplayPlace_Zone_Fragment = { readonly __typename?: 'Zone' } & {
  readonly name: { readonly __typename?: 'SecuredString' } & Pick<
    Types.SecuredString,
    'value'
  >;
};

export type DisplayPlace_Region_Fragment = {
  readonly __typename?: 'Region';
} & {
  readonly name: { readonly __typename?: 'SecuredString' } & Pick<
    Types.SecuredString,
    'value'
  >;
};

export type DisplayPlace_Country_Fragment = {
  readonly __typename?: 'Country';
} & {
  readonly name: { readonly __typename?: 'SecuredString' } & Pick<
    Types.SecuredString,
    'value'
  >;
};

export type DisplayPlaceFragment =
  | DisplayPlace_Zone_Fragment
  | DisplayPlace_Region_Fragment
  | DisplayPlace_Country_Fragment;

export const DisplayPlaceFragmentDoc = gql`
  fragment DisplayPlace on Place {
    name {
      value
    }
  }
`;
export const DisplayRegionFragmentDoc = gql`
  fragment DisplayRegion on Region {
    ...DisplayPlace
    zone {
      value {
        ...DisplayPlace
      }
    }
  }
  ${DisplayPlaceFragmentDoc}
`;
export const DisplayCountryFragmentDoc = gql`
  fragment DisplayCountry on Country {
    ...DisplayPlace
    region {
      value {
        ...DisplayRegion
      }
    }
  }
  ${DisplayPlaceFragmentDoc}
  ${DisplayRegionFragmentDoc}
`;
export const DisplayZoneFragmentDoc = gql`
  fragment DisplayZone on Zone {
    ...DisplayPlace
  }
  ${DisplayPlaceFragmentDoc}
`;
export const DisplayLocationFragmentDoc = gql`
  fragment DisplayLocation on Location {
    ... on Country {
      ...DisplayCountry
    }
    ... on Region {
      ...DisplayRegion
    }
    ... on Zone {
      ...DisplayZone
    }
  }
  ${DisplayCountryFragmentDoc}
  ${DisplayRegionFragmentDoc}
  ${DisplayZoneFragmentDoc}
`;
