import { PossibleTypesMap } from '@apollo/client';

export const possibleTypes: PossibleTypesMap = {
  Project: ['TranslationProject', 'InternshipProject'],
  Place: ['Country', 'Region', 'Zone'],
  Location: ['Country', 'Region', 'Zone'],
};
