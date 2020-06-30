/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import { DisplayLocation_Country_Fragment } from '../../../api/fragments/location.generated';
import { DisplayLocationFragmentDoc } from '../../../api/fragments/location.generated';
import * as Types from '../../../api/schema.generated';
import { CeremonyCardFragment } from '../../../components/CeremonyCard/CeremonyCard.generated';
import { CeremonyCardFragmentDoc } from '../../../components/CeremonyCard/CeremonyCard.generated';
import { MentorCardFragment } from '../../../components/MentorCard/MentorCard.generated';
import { MentorCardFragmentDoc } from '../../../components/MentorCard/MentorCard.generated';

export type InternshipEngagementDetailFragment = {
  __typename?: 'InternshipEngagement';
} & Pick<Types.InternshipEngagement, 'id' | 'createdAt'> & {
    intern: { __typename?: 'SecuredUser' } & Pick<
      Types.SecuredUser,
      'canRead' | 'canEdit'
    > & {
        value?: Types.Maybe<
          { __typename?: 'User' } & Pick<Types.User, 'fullName'>
        >;
      };
    position: { __typename?: 'SecuredInternPosition' } & Pick<
      Types.SecuredInternPosition,
      'canRead' | 'canEdit' | 'value'
    >;
    startDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    endDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    completeDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    disbursementCompleteDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    communicationsCompleteDate: { __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    countryOfOrigin: { __typename?: 'SecuredCountry' } & Pick<
      Types.SecuredCountry,
      'canRead' | 'canEdit'
    > & {
        value?: Types.Maybe<
          { __typename?: 'Country' } & DisplayLocation_Country_Fragment
        >;
      };
    mentor: { __typename?: 'SecuredUser' } & {
      value?: Types.Maybe<{ __typename?: 'User' } & MentorCardFragment>;
    };
    ceremony: { __typename?: 'SecuredCeremony' } & Pick<
      Types.SecuredCeremony,
      'canRead' | 'canEdit'
    > & {
        value?: Types.Maybe<{ __typename?: 'Ceremony' } & CeremonyCardFragment>;
      };
  };

export const InternshipEngagementDetailFragmentDoc = gql`
  fragment InternshipEngagementDetail on InternshipEngagement {
    id
    createdAt
    intern {
      value {
        fullName
      }
      canRead
      canEdit
    }
    position {
      canRead
      canEdit
      value
    }
    startDate {
      value
      canRead
      canEdit
    }
    endDate {
      value
      canRead
      canEdit
    }
    completeDate {
      value
      canRead
      canEdit
    }
    disbursementCompleteDate {
      value
      canRead
      canEdit
    }
    communicationsCompleteDate {
      value
      canRead
      canEdit
    }
    countryOfOrigin {
      canRead
      canEdit
      value {
        ...DisplayLocation
      }
    }
    mentor {
      value {
        ...MentorCard
      }
    }
    ceremony {
      canRead
      canEdit
      value {
        ...CeremonyCard
      }
    }
  }
  ${DisplayLocationFragmentDoc}
  ${MentorCardFragmentDoc}
  ${CeremonyCardFragmentDoc}
`;
