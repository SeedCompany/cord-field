/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import gql from 'graphql-tag';
import type { DisplayCountryFragment } from '../../api/fragments/location.generated';
import { DisplayCountryFragmentDoc } from '../../api/fragments/location.generated';
import type * as Types from '../../api/schema.generated';

export type ProjectListItem_TranslationProject_Fragment = {
  readonly __typename?: 'TranslationProject';
} & Pick<
  Types.TranslationProject,
  'id' | 'createdAt' | 'type' | 'sensitivity' | 'status' | 'modifiedAt'
> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly deptId: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly step: { readonly __typename?: 'SecuredProjectStep' } & Pick<
      Types.SecuredProjectStep,
      'value'
    >;
    readonly location: { readonly __typename?: 'SecuredCountry' } & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'Country' } & DisplayCountryFragment
      >;
    };
    readonly estimatedSubmission: {
      readonly __typename?: 'SecuredDate';
    } & Pick<Types.SecuredDate, 'value'>;
  };

export type ProjectListItem_InternshipProject_Fragment = {
  readonly __typename?: 'InternshipProject';
} & Pick<
  Types.InternshipProject,
  'id' | 'createdAt' | 'type' | 'sensitivity' | 'status' | 'modifiedAt'
> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly deptId: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly step: { readonly __typename?: 'SecuredProjectStep' } & Pick<
      Types.SecuredProjectStep,
      'value'
    >;
    readonly location: { readonly __typename?: 'SecuredCountry' } & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'Country' } & DisplayCountryFragment
      >;
    };
    readonly estimatedSubmission: {
      readonly __typename?: 'SecuredDate';
    } & Pick<Types.SecuredDate, 'value'>;
  };

export type ProjectListItemFragment =
  | ProjectListItem_TranslationProject_Fragment
  | ProjectListItem_InternshipProject_Fragment;

export const ProjectListItemFragmentDoc = gql`
  fragment ProjectListItem on Project {
    id
    createdAt
    name {
      value
    }
    type
    sensitivity
    deptId {
      value
    }
    step {
      value
    }
    status
    location {
      value {
        ...DisplayCountry
      }
    }
    estimatedSubmission {
      value
    }
    modifiedAt
  }
  ${DisplayCountryFragmentDoc}
`;
