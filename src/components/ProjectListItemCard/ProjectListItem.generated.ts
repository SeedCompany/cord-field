/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import gql from 'graphql-tag';
import { DisplayCountryFragment } from '../../api/fragments/location.generated';
import { DisplayCountryFragmentDoc } from '../../api/fragments/location.generated';
import * as Types from '../../api/schema.generated';

export type ProjectListItem_InternshipProject_Fragment = {
  __typename?: 'InternshipProject';
} & Pick<
  Types.InternshipProject,
  'id' | 'createdAt' | 'type' | 'sensitivity' | 'status' | 'modifiedAt'
> & {
    name: { __typename?: 'SecuredString' } & Pick<Types.SecuredString, 'value'>;
    deptId: { __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    step: { __typename?: 'SecuredProjectStep' } & Pick<
      Types.SecuredProjectStep,
      'value'
    >;
    location: { __typename?: 'SecuredCountry' } & {
      value?: Types.Maybe<{ __typename?: 'Country' } & DisplayCountryFragment>;
    };
    estimatedSubmission: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value'
    >;
  };

export type ProjectListItem_TranslationProject_Fragment = {
  __typename?: 'TranslationProject';
} & Pick<
  Types.TranslationProject,
  'id' | 'createdAt' | 'type' | 'sensitivity' | 'status' | 'modifiedAt'
> & {
    name: { __typename?: 'SecuredString' } & Pick<Types.SecuredString, 'value'>;
    deptId: { __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    step: { __typename?: 'SecuredProjectStep' } & Pick<
      Types.SecuredProjectStep,
      'value'
    >;
    location: { __typename?: 'SecuredCountry' } & {
      value?: Types.Maybe<{ __typename?: 'Country' } & DisplayCountryFragment>;
    };
    estimatedSubmission: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value'
    >;
  };

export type ProjectListItemFragment =
  | ProjectListItem_InternshipProject_Fragment
  | ProjectListItem_TranslationProject_Fragment;

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
