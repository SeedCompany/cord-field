/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type LanguageEngagementListItemFragment = {
  readonly __typename?: 'LanguageEngagement';
} & Pick<Types.LanguageEngagement, 'id' | 'status'> & {
    readonly language: { readonly __typename?: 'SecuredLanguage' } & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'Language' } & Pick<
          Types.Language,
          'avatarLetters'
        > & {
            readonly name: { readonly __typename?: 'SecuredString' } & Pick<
              Types.SecuredString,
              'value'
            >;
            readonly displayName: {
              readonly __typename?: 'SecuredString';
            } & Pick<Types.SecuredString, 'value'>;
            readonly population: { readonly __typename?: 'SecuredInt' } & Pick<
              Types.SecuredInt,
              'value'
            >;
            readonly registryOfDialectsCode: {
              readonly __typename?: 'SecuredString';
            } & Pick<Types.SecuredString, 'value'>;
          }
      >;
    };
    readonly products: { readonly __typename?: 'SecuredProductList' } & Pick<
      Types.SecuredProductList,
      'total'
    > & {
        readonly items: ReadonlyArray<
          | ({ readonly __typename?: 'DirectScriptureProduct' } & Pick<
              Types.DirectScriptureProduct,
              'id'
            >)
          | ({ readonly __typename?: 'DerivativeScriptureProduct' } & Pick<
              Types.DerivativeScriptureProduct,
              'id'
            >)
        >;
      };
    readonly endDate: { readonly __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value'
    >;
    readonly initialEndDate: { readonly __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value'
    >;
    readonly completeDate: { readonly __typename?: 'SecuredDate' } & Pick<
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
