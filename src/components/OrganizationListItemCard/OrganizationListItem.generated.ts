/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type OrganizationListItemFragment = {
  __typename?: 'Organization';
} & Pick<Types.Organization, 'id'> & {
    name: { __typename?: 'SecuredString' } & Pick<Types.SecuredString, 'value'>;
  };

export const OrganizationListItemFragmentDoc = gql`
  fragment OrganizationListItem on Organization {
    id
    name {
      value
    }
  }
`;
