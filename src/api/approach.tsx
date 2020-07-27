import {
  Hearing,
  MenuBook,
  PlayCircleFilled,
  Translate,
} from '@material-ui/icons';
import React, { ReactNode } from 'react';
import { ProductApproach, ProductMethodology } from './schema.generated';

export const MethodologyToApproach: Record<
  ProductMethodology,
  ProductApproach
> = {
  // Written
  Paratext: 'Written',
  OtherWritten: 'Written',

  // Oral Translation
  Render: 'OralTranslation',
  OtherOralTranslation: 'OralTranslation',

  // Oral Stories
  BibleStories: 'OralStories',
  BibleStorying: 'OralStories',
  OneStory: 'OralStories',
  OtherOralStories: 'OralStories',

  // Visual
  Film: 'Visual',
  SignLanguage: 'Visual',
  OtherVisual: 'Visual',
};

export const ApproachIcons: Record<ProductApproach, ReactNode> = {
  Written: <MenuBook color="inherit" fontSize="inherit" />,
  OralTranslation: <Translate color="inherit" fontSize="inherit" />,
  OralStories: <Hearing color="inherit" fontSize="inherit" />,
  Visual: <PlayCircleFilled color="inherit" fontSize="inherit" />,
};
