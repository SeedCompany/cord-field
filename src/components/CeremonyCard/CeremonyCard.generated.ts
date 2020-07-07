/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type CeremonyCardFragment = { __typename?: 'Ceremony' } & Pick<
  Types.Ceremony,
  'id' | 'type'
> & {
    planned: { __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
      'canRead' | 'canEdit' | 'value'
    >;
    estimatedDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value'
    >;
    actualDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value'
    >;
  };

export const CeremonyCardFragmentDoc = gql`
  fragment CeremonyCard on Ceremony {
    id
    type
    planned {
      canRead
      canEdit
      value
    }
    estimatedDate {
      value
    }
    actualDate {
      value
    }
  }
`;
