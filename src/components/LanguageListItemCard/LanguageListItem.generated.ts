/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type LanguageListItemFragment = {
  readonly __typename?: 'Language';
} & Pick<Types.Language, 'id'> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly displayName: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly ethnologue: { readonly __typename?: 'EthnologueLanguage' } & {
      readonly code: { readonly __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value'
      >;
    };
    readonly registryOfDialectsCode: {
      readonly __typename?: 'SecuredString';
    } & Pick<Types.SecuredString, 'value'>;
    readonly population: { readonly __typename?: 'SecuredInt' } & Pick<
      Types.SecuredInt,
      'value'
    >;
  };

export const LanguageListItemFragmentDoc = gql`
  fragment LanguageListItem on Language {
    id
    name {
      value
    }
    displayName {
      value
    }
    ethnologue {
      code {
        value
      }
    }
    registryOfDialectsCode {
      value
    }
    population {
      value
    }
  }
`;
