/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { CeremonyCardFragment } from '../CeremonyCard/CeremonyCard.generated';
import { CeremonyCardFragmentDoc } from '../CeremonyCard/CeremonyCard.generated';

export type LanguageEngagementDetailFragment = {
  readonly __typename?: 'LanguageEngagement';
} & Pick<
  Types.LanguageEngagement,
  'id' | 'createdAt' | 'modifiedAt' | 'status'
> & {
    readonly language: { readonly __typename?: 'SecuredLanguage' } & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'Language' } & Pick<Types.Language, 'id'> & {
            readonly displayName: {
              readonly __typename?: 'SecuredString';
            } & Pick<Types.SecuredString, 'value'>;
            readonly name: { readonly __typename?: 'SecuredString' } & Pick<
              Types.SecuredString,
              'value'
            >;
          }
      >;
    };
    readonly lukePartnership: { readonly __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
      'canRead' | 'canEdit' | 'value'
    >;
    readonly firstScripture: { readonly __typename?: 'SecuredBoolean' } & Pick<
      Types.SecuredBoolean,
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
    readonly ceremony: {
      readonly __typename?: 'SecuredCeremony';
    } & CeremonyCardFragment;
  };

export const LanguageEngagementDetailFragmentDoc = gql`
  fragment LanguageEngagementDetail on LanguageEngagement {
    id
    createdAt
    language {
      value {
        id
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
