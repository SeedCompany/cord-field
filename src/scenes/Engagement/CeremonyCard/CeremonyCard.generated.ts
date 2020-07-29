/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export type CeremonyFragment = { readonly __typename?: 'Ceremony' } & Pick<
  Types.Ceremony,
  'id' | 'type'
> & {
    readonly planned: { readonly __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
      'canRead' | 'canEdit' | 'value'
    >;
    readonly estimatedDate: { readonly __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'canRead' | 'canEdit' | 'value'
    >;
    readonly actualDate: { readonly __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'canRead' | 'canEdit' | 'value'
    >;
  };

export type CeremonyCardFragment = {
  readonly __typename?: 'SecuredCeremony';
} & Pick<Types.SecuredCeremony, 'canRead'> & {
    readonly value?: Types.Maybe<
      { readonly __typename?: 'Ceremony' } & CeremonyFragment
    >;
  };

export const CeremonyFragmentDoc = gql`
  fragment Ceremony on Ceremony {
    id
    type
    planned {
      canRead
      canEdit
      value
    }
    estimatedDate {
      canRead
      canEdit
      value
    }
    actualDate {
      canRead
      canEdit
      value
    }
  }
`;
export const CeremonyCardFragmentDoc = gql`
  fragment CeremonyCard on SecuredCeremony {
    canRead
    value {
      ...Ceremony
    }
  }
  ${CeremonyFragmentDoc}
`;
