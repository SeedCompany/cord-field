import {
  Hearing,
  MenuBook,
  PlayCircleFilled,
  Translate,
} from '@mui/icons-material';
import { entries, mapValues } from '@seedcompany/common';
import { ReactNode } from 'react';
import { ProductApproach, ProductMethodology } from '~/api/schema.graphql';

export const ApproachMethodologies: Record<
  ProductApproach,
  ProductMethodology[]
> = {
  Written: ['Paratext', 'OtherWritten'],
  OralTranslation: [
    'Render',
    'Audacity',
    'AdobeAudition',
    'OtherOralTranslation',
  ],
  OralStories: [
    'StoryTogether',
    'SeedCompanyMethod',
    'OneStory',
    'Craft2Tell',
    'OtherOralStories',
  ],
  Visual: ['Film', 'SignLanguage', 'OtherVisual'],
};

export const MethodologyToApproach = entries(ApproachMethodologies).reduce(
  (map, [approach, methodologies]) => ({
    ...map,
    ...mapValues.fromList(methodologies, () => approach).asRecord,
  }),
  {}
) as Record<ProductMethodology, ProductApproach>;

export const ApproachIcons: Record<ProductApproach, ReactNode> = {
  Written: <MenuBook color="inherit" fontSize="inherit" />,
  OralTranslation: <Translate color="inherit" fontSize="inherit" />,
  OralStories: <Hearing color="inherit" fontSize="inherit" />,
  Visual: <PlayCircleFilled color="inherit" fontSize="inherit" />,
};
