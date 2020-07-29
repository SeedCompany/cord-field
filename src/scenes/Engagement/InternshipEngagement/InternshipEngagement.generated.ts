/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import { DisplayLocation_Country_Fragment } from '../../../api/fragments/location.generated';
import { DisplayLocationFragmentDoc } from '../../../api/fragments/location.generated';
import * as Types from '../../../api/schema.generated';
import { MethodologiesCardFragment } from '../../../components/MethodologiesCard/MethodologiesCard.generated';
import { MethodologiesCardFragmentDoc } from '../../../components/MethodologiesCard/MethodologiesCard.generated';
import { CeremonyCardFragment } from '../CeremonyCard/CeremonyCard.generated';
import { CeremonyCardFragmentDoc } from '../CeremonyCard/CeremonyCard.generated';
import { MentorCardFragment } from './MentorCard/MentorCard.generated';
import { MentorCardFragmentDoc } from './MentorCard/MentorCard.generated';

export type InternshipEngagementDetailFragment = {
  readonly __typename?: 'InternshipEngagement';
} & Pick<
  Types.InternshipEngagement,
  'id' | 'createdAt' | 'status' | 'modifiedAt'
> & {
    readonly intern: { readonly __typename?: 'SecuredUser' } & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'User' } & Pick<Types.User, 'id' | 'fullName'>
      >;
    };
    readonly position: { readonly __typename?: 'SecuredInternPosition' } & Pick<
      Types.SecuredInternPosition,
      'canRead' | 'canEdit' | 'value'
    >;
    readonly startDate: { readonly __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    readonly endDate: { readonly __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    readonly completeDate: { readonly __typename?: 'SecuredDate' } & Pick<
      Types.SecuredDate,
      'value' | 'canRead' | 'canEdit'
    >;
    readonly disbursementCompleteDate: {
      readonly __typename?: 'SecuredDate';
    } & Pick<Types.SecuredDate, 'value' | 'canRead' | 'canEdit'>;
    readonly communicationsCompleteDate: {
      readonly __typename?: 'SecuredDate';
    } & Pick<Types.SecuredDate, 'value' | 'canRead' | 'canEdit'>;
    readonly countryOfOrigin: { readonly __typename?: 'SecuredCountry' } & Pick<
      Types.SecuredCountry,
      'canRead' | 'canEdit'
    > & {
        readonly value?: Types.Maybe<
          { readonly __typename?: 'Country' } & DisplayLocation_Country_Fragment
        >;
      };
    readonly mentor: {
      readonly __typename?: 'SecuredUser';
    } & MentorCardFragment;
    readonly ceremony: {
      readonly __typename?: 'SecuredCeremony';
    } & CeremonyCardFragment;
    readonly methodologies: {
      readonly __typename?: 'SecuredMethodologies';
    } & MethodologiesCardFragment;
  };

export const InternshipEngagementDetailFragmentDoc = gql`
  fragment InternshipEngagementDetail on InternshipEngagement {
    id
    createdAt
    status
    modifiedAt
    intern {
      value {
        id
        fullName
      }
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
      ...MentorCard
    }
    ceremony {
      ...CeremonyCard
    }
    methodologies {
      ...MethodologiesCard
    }
  }
  ${DisplayLocationFragmentDoc}
  ${MentorCardFragmentDoc}
  ${CeremonyCardFragmentDoc}
  ${MethodologiesCardFragmentDoc}
`;
