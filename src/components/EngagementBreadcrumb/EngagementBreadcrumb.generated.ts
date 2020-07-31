/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type EngagementBreadcrumb_LanguageEngagement_Fragment = {
  readonly __typename?: 'LanguageEngagement';
} & Pick<Types.LanguageEngagement, 'id'> & {
    readonly language: { readonly __typename?: 'SecuredLanguage' } & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'Language' } & {
          readonly name: { readonly __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'canRead' | 'value'
          >;
        }
      >;
    };
  };

export type EngagementBreadcrumb_InternshipEngagement_Fragment = {
  readonly __typename?: 'InternshipEngagement';
} & Pick<Types.InternshipEngagement, 'id'>;

export type EngagementBreadcrumbFragment =
  | EngagementBreadcrumb_LanguageEngagement_Fragment
  | EngagementBreadcrumb_InternshipEngagement_Fragment;

export const EngagementBreadcrumbFragmentDoc = gql`
  fragment EngagementBreadcrumb on Engagement {
    id
    ... on LanguageEngagement {
      language {
        value {
          name {
            canRead
            value
          }
        }
      }
    }
  }
`;
