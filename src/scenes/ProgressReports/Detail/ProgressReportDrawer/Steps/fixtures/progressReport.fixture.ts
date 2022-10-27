import { PromptVariant } from '../../../../ProgressReportContext';
import { prompts } from './prompts.fixtures';
import { ProgressReport } from './types.fixture';
import { responses } from './variantResponses.fixtures';

const TeamHighLightVariant = {
  __typename: 'VariantPromptResponse',
  id: 'abcdefg',
  prompt: {
    __typename: 'Prompt',
    id: 'obstacle',
    prompt: {
      canRead: true,
      canEdit: false,
      value:
        'What are the biggest obstacles team members are facing in reaching their goals? How are they dealing with those obstacles? (Ex: translation difficulties, political unrest, suppression of faith)',
    },
  },
  responses: [
    // can add more for testing
    ...responses,
  ],
};

export type VariantPromptResponse = typeof TeamHighLightVariant;

export const progressReport: ProgressReport = {
  highlights: {
    canRead: true,
    canCreate: true,
    total: 1,
    items: [TeamHighLightVariant],
    options: {
      prompts: [
        // can add if needed for testing
        ...prompts,
      ],
      variants: [
        'Partner',
        'Translation',
        'FPM Notes',
        'Communications Edit',
      ] as PromptVariant[],
    },
  },
};
