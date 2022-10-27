import { PromptVariant } from '../../../../ProgressReportContext';

const partnerResponse = {
  __typename: 'VariantResponse',
  variant: 'Partner' as PromptVariant,
  response: {
    canRead: true,
    canEdit: true,
    value: null as string | null, // or rich text json
  },
};

const translationResponse = {
  __typename: 'VariantResponse',
  variant: 'Translation' as PromptVariant,
  response: {
    canRead: true,
    canEdit: true,
    value: null as string | null, // or rich text json
  },
};

const projectManagerResponse = {
  __typename: 'VariantResponse',
  variant: 'FPM Notes' as PromptVariant,
  response: {
    canRead: true,
    canEdit: true,
    value: null as string | null, // or rich text json
  },
};

const communicationResponse = {
  __typename: 'VariantResponse',
  variant: 'Communications Edit' as PromptVariant,
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
