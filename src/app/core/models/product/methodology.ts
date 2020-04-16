import { buildEnum } from '@app/core/models/enum';

export enum ProductMethodology {
  // Written
  Paratext = 'written_paratext',
  OtherWritten = 'written_other',

  // Oral Translation
  Render = 'oral_translation_render',
  OtherOralTranslation = 'oral_translation_other',

  // Oral Stories
  StoryTogether = 'oral_stories_bible_stories',
  SeedCompanyMethod = 'oral_stories_bible_storying',
  OneStory = 'oral_stories_one_story',
  OtherOralStories = 'oral_stories_other',

  // Visual
  Film = 'visual_film',
  SignLanguage = 'visual_sign_language',
  OtherVisual = 'visual_other',
}

export namespace ProductMethodology {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProductMethodology, {
    [ProductMethodology.Paratext]: 'Paratext',
    [ProductMethodology.OtherWritten]: 'Other (Written)',
    [ProductMethodology.Render]: 'Render',
    [ProductMethodology.OtherOralTranslation]: 'Other (Oral Translation)',
    [ProductMethodology.StoryTogether]: 'Story Together',
    [ProductMethodology.SeedCompanyMethod]: 'Seed Company Method',
    [ProductMethodology.OneStory]: 'One Story',
    [ProductMethodology.OtherOralStories]: 'Other (Oral Stories)',
    [ProductMethodology.Film]: 'Film',
    [ProductMethodology.SignLanguage]: 'Sign Language',
    [ProductMethodology.OtherVisual]: 'Other (Visual)',
  });

  export const Groups = {
    'Written': [
      ProductMethodology.Paratext,
      ProductMethodology.OtherWritten,
    ],
    'Oral Translation': [
      ProductMethodology.Render,
      ProductMethodology.OtherOralTranslation,
    ],
    'Oral Stories': [
      ProductMethodology.StoryTogether,
      ProductMethodology.SeedCompanyMethod,
      ProductMethodology.OneStory,
      ProductMethodology.OtherOralStories,
    ],
    'Visual': [
      ProductMethodology.Film,
      ProductMethodology.SignLanguage,
      ProductMethodology.OtherVisual,
    ],
  };

  export const groupEntries = Object.entries(Groups);
}
