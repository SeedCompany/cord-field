import {
  Hearing,
  MenuBook,
  PlayCircleFilled,
  Translate,
} from '@material-ui/icons';
import React, { ReactNode } from 'react';
import { entries, mapFromList } from '../util';
import { ProductApproach, ProductMethodology } from './schema.graphql';

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
    ...mapFromList(methodologies, (methodology) => [methodology, approach]),
  }),
  {}
) as Record<ProductMethodology, ProductApproach>;

export const ApproachIcons: Record<ProductApproach, ReactNode> = {
  Written: <MenuBook color="inherit" fontSize="inherit" />,
  OralTranslation: <Translate color="inherit" fontSize="inherit" />,
  OralStories: <Hearing color="inherit" fontSize="inherit" />,
  Visual: <PlayCircleFilled color="inherit" fontSize="inherit" />,
};
