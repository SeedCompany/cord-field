/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import gql from 'graphql-tag';
import { DisplayCountryFragment } from '../../api/fragments/location.generated';
import { DisplayCountryFragmentDoc } from '../../api/fragments/location.generated';
import * as Types from '../../api/schema.generated';

export type InternshipEngagementListItemFragment = {
  __typename?: 'InternshipEngagement';
} & Pick<Types.InternshipEngagement, 'id' | 'status'> & {
    intern: { __typename?: 'SecuredUser' } & {
      value?: Types.Maybe<
        { __typename?: 'User' } & Pick<Types.User, 'fullName'>
      >;
    };
    countryOfOrigin: { __typename?: 'SecuredCountry' } & {
      value?: Types.Maybe<{ __typename?: 'Country' } & DisplayCountryFragment>;
    };
    position: { __typename?: 'SecuredInternPosition' } & Pick<
      Types.SecuredInternPosition,
      'value'
    >;
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
