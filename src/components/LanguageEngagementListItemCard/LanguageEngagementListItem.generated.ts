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
            population: { __typename?: 'SecuredInt' } & Pick<
              Types.SecuredInt,
              'value'
            >;
            registryOfDialectsCode: { __typename?: 'SecuredString' } & Pick<
              Types.SecuredString,
              'value'
            >;
          }
      >;
    };
    products: { __typename?: 'SecuredProductList' } & Pick<
      Types.SecuredProductList,
      'total'
    > & {
        items: Array<
          | ({ __typename?: 'DirectScriptureProduct' } & Pick<
              Types.DirectScriptureProduct,
              'id'
            >)
          | ({ __typename?: 'DerivativeScriptureProduct' } & Pick<
              Types.DerivativeScriptureProduct,
              'id'
            >)
        >;
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
        population {
          value
        }
        registryOfDialectsCode {
          value
        }
        avatarLetters
      }
    }
    products {
      total
      items {
        id
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
