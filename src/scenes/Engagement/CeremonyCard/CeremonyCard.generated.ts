/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export type CeremonyFragment = { __typename?: 'Ceremony' } & Pick<
  Types.Ceremony,
  'id' | 'type'
> & {
    planned: { __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
      'canRead' | 'canEdit' | 'value'
    >;
    estimatedDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'canRead' | 'canEdit' | 'value'
    >;
    actualDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'canRead' | 'canEdit' | 'value'
    >;
  };

export type CeremonyCardFragment = { __typename?: 'SecuredCeremony' } & Pick<
  Types.SecuredCeremony,
  'canRead'
> & { value?: Types.Maybe<{ __typename?: 'Ceremony' } & CeremonyFragment> };

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
