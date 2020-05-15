/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type LanguageEngagementListItemFragment = {
  __typename?: 'LanguageEngagement';
} & Pick<Types.LanguageEngagement, 'id' | 'status'> & {
    language: { __typename?: 'SecuredLanguage' } & {
      value?: Types.Maybe<
        { __typename?: 'Language' } & Pick<Types.Language, 'avatarLetters'> & {
            name: { __typename?: 'SecuredString' } & Pick<
              Types.SecuredString,
              'value'
            >;
            displayName: { __typename?: 'SecuredString' } & Pick<
              Types.SecuredString,
              'value'
            >;
            ethnologuePopulation?: Types.Maybe<
              { __typename?: 'SecuredInt' } & Pick<Types.SecuredInt, 'value'>
            >;
            organizationPopulation?: Types.Maybe<
              { __typename?: 'SecuredInt' } & Pick<Types.SecuredInt, 'value'>
            >;
            rodNumber?: Types.Maybe<
              { __typename?: 'SecuredInt' } & Pick<Types.SecuredInt, 'value'>
            >;
          }
      >;
    };
    products: { __typename?: 'SecuredProductList' } & Pick<
      Types.SecuredProductList,
      'total'
    > & {
        items: Array<{ __typename?: 'Product' } & Pick<Types.Product, 'type'>>;
      };
    endDate: { __typename?: 'SecuredDate' } & Pick<Types.SecuredDate, 'value'>;
    initialEndDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value'
    >;
    completeDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value'
    >;
  };

export const LanguageEngagementListItemFragmentDoc = gql`
  fragment LanguageEngagementListItem on LanguageEngagement {
    id
    status
    language {
      value {
        name {
          value
        }
        displayName {
          value
        }
        ethnologuePopulation {
          value
        }
        organizationPopulation {
          value
        }
        rodNumber {
          value
        }
        avatarLetters
      }
    }
    products {
      total
      items {
        type
      }
    }
    endDate {
      value
    }
    initialEndDate {
      value
    }
    completeDate {
      value
    }
  }
`;
