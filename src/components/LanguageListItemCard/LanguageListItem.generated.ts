/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type LanguageListItemFragment = { __typename?: 'Language' } & Pick<
  Types.Language,
  'id'
> & {
    name: { __typename?: 'SecuredString' } & Pick<Types.SecuredString, 'value'>;
    displayName: { __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    ethnologue: { __typename?: 'EthnologueLanguage' } & {
      code: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value'
      >;
    };
    registryOfDialectsCode: { __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    population: { __typename?: 'SecuredInt' } & Pick<Types.SecuredInt, 'value'>;
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
