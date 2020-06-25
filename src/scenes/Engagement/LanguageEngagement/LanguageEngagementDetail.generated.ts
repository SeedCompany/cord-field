/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export type LanguageEngagementDetailFragment = {
  __typename?: 'LanguageEngagement';
} & Pick<Types.LanguageEngagement, 'id' | 'createdAt'> & {
    language: { __typename?: 'SecuredLanguage' } & {
      value?: Types.Maybe<
        { __typename?: 'Language' } & {
          name: { __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'value'
          >;
        }
      >;
    };
  };

export type ProjectBreadcrumb_InternshipProject_Fragment = {
  __typename?: 'InternshipProject';
} & Pick<Types.InternshipProject, 'id'> & {
    name: { __typename?: 'SecuredString' } & Pick<Types.SecuredString, 'value'>;
  };

export type ProjectBreadcrumb_TranslationProject_Fragment = {
  __typename?: 'TranslationProject';
} & Pick<Types.TranslationProject, 'id'> & {
    name: { __typename?: 'SecuredString' } & Pick<Types.SecuredString, 'value'>;
  };

export type ProjectBreadcrumbFragment =
  | ProjectBreadcrumb_InternshipProject_Fragment
  | ProjectBreadcrumb_TranslationProject_Fragment;

export const LanguageEngagementDetailFragmentDoc = gql`
  fragment LanguageEngagementDetail on LanguageEngagement {
    id
    createdAt
    language {
      value {
        name {
          value
        }
      }
    }
  }
`;
export const ProjectBreadcrumbFragmentDoc = gql`
  fragment ProjectBreadcrumb on Project {
    id
    name {
      value
    }
  }
`;
