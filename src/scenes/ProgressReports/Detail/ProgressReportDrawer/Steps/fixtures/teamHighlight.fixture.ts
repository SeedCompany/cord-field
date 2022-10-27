export const teamHighlight = {
  __typename: 'VariantPromptResponse',
  id: '',
  prompt: {
    __typename: 'Prompt',
    id: 'obstacle',
    prompt: {
      canRead: true,
      canEdit: false,
      value:
        'What are the biggest obstacles team members are facing in reaching their goals? How are they dealing with those obstacles? (Ex: translation difficulties, political unrest, suppression of faith)',
    },
    variants: [
      {
        __typename: 'VariantResponse',
        variant: 'Partner',
        response: {
          canRead: true,
          canEdit: true,
          value: null as string | null, // or rich text json
        },
      },
      {
        __typename: 'VariantResponse',
        variant: 'Translation',
        response: {
          canRead: true,
          canEdit: true,
          value: null as string | null, // or rich text json
        },
      },
      {
        __typename: 'VariantResponse',
        variant: 'FPM Notes',
        response: {
          canRead: true,
          canEdit: true,
          value: null as string | null, // or rich text json
        },
      },
      {
        __typename: 'VariantResponse',
        variant: 'Communications Edit',
        response: {
          canRead: true,
          canEdit: true,
          value: null as string | null, // or rich text json
        },
      },
    ],
  },
};

export type VariantPromptResponse = typeof teamHighlight;
