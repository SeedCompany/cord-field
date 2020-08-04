/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import gql from 'graphql-tag';
import type { DisplayCountryFragment } from '../../api/fragments/location.generated';
import { DisplayCountryFragmentDoc } from '../../api/fragments/location.generated';
import type * as Types from '../../api/schema.generated';

export type InternshipEngagementListItemFragment = {
  readonly __typename?: 'InternshipEngagement';
} & Pick<Types.InternshipEngagement, 'id' | 'status'> & {
    readonly intern: { readonly __typename?: 'SecuredUser' } & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'User' } & Pick<Types.User, 'fullName'>
      >;
    };
    readonly countryOfOrigin: { readonly __typename?: 'SecuredCountry' } & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'Country' } & DisplayCountryFragment
      >;
    };
    readonly position: { readonly __typename?: 'SecuredInternPosition' } & Pick<
      Types.SecuredInternPosition,
      'value'
    >;
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

export const InternshipEngagementListItemFragmentDoc = gql`
  fragment InternshipEngagementListItem on InternshipEngagement {
    id
    status
    intern {
      value {
        fullName
      }
    }
    countryOfOrigin {
      value {
        ...DisplayCountry
      }
    }
    position {
      value
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
  ${DisplayCountryFragmentDoc}
`;
