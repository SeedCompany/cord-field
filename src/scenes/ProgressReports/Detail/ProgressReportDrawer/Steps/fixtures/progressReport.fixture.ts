import { PromptVariant } from '../../../../ProgressReportContext';
import { prompts } from './prompts.fixtures';
import { ProgressReport } from './types.fixture';
import { responses } from './variantResponses.fixtures';

const TeamHighLightVariant = {
  __typename: 'VariantPromptResponse',
  id: 'abcdefg',
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  prompt: {} as any | null,
  responses: [
    // can add more for testing
    ...responses,
  ],
};

export type VariantPromptResponse = typeof TeamHighLightVariant;

export const progressReport: ProgressReport = {
  highlights: {
    available: {
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
  },
};
