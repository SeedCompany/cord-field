/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { CeremonyCardFragment } from '../../../components/CeremonyCard/CeremonyCard.generated';
import { CeremonyCardFragmentDoc } from '../../../components/CeremonyCard/CeremonyCard.generated';

export type LanguageEngagementDetailFragment = {
  __typename?: 'LanguageEngagement';
} & Pick<
  Types.LanguageEngagement,
  'id' | 'createdAt' | 'modifiedAt' | 'status'
> & {
    language: { __typename?: 'SecuredLanguage' } & {
      value?: Types.Maybe<
        { __typename?: 'Language' } & {
          displayName: { __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'value'
          >;
          name: { __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'value'
          >;
        }
      >;
    };
    lukePartnership: { __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
      'canRead' | 'canEdit' | 'value'
    >;
    firstScripture: { __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
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
    ceremony: { __typename?: 'SecuredCeremony' } & CeremonyCardFragment;
  };

export const LanguageEngagementDetailFragmentDoc = gql`
  fragment LanguageEngagementDetail on LanguageEngagement {
    id
    createdAt
    language {
      value {
        displayName {
          value
        }
        name {
          value
        }
      }
    }
    lukePartnership {
      canRead
      canEdit
      value
    }
    firstScripture {
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
    modifiedAt
    status
    ceremony {
      ...CeremonyCard
    }
  }
  ${CeremonyCardFragmentDoc}
`;
