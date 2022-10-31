import { Role } from '~/api/schema.graphql';

const partnerResponse = {
  __typename: 'VariantResponse',
  variant: 'Partner' as Role,
  response: {
    canRead: true,
    canEdit: true,
    value: null as string | null, // or rich text json
  },
};

const translationResponse = {
  __typename: 'VariantResponse',
  variant: 'Translation' as Role,
  response: {
    canRead: true,
    canEdit: true,
    value: null as string | null, // or rich text json
  },
};

const projectManagerResponse = {
  __typename: 'VariantResponse',
  variant: 'FPM Notes' as Role,
  response: {
    canRead: true,
    canEdit: true,
    value: null as string | null, // or rich text json
  },
};

const communicationResponse = {
  __typename: 'VariantResponse',
  variant: 'Communications Edit' as Role,
  response: {
    canRead: true,
    canEdit: true,
    value: null as string | null, // or rich text json
  },
};

export type VariantResponse = typeof partnerResponse;

export const responses: VariantResponse[] = [
  partnerResponse,
  translationResponse,
  projectManagerResponse,
  communicationResponse,
];
