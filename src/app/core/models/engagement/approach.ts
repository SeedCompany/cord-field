import { buildEnum } from '@app/core/models/enum';

export enum ProjectApproach {
  OralStorying = 'os',
  OralTranslation = 'ot',
  Written = 'wt',
  SignLanguage = 'sl',
}

export namespace ProjectApproach {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProjectApproach, {
    [ProjectApproach.OralStorying]: 'Oral Storying',
    [ProjectApproach.OralTranslation]: 'Oral Translation',
    [ProjectApproach.Written]: 'Written',
    [ProjectApproach.SignLanguage]: 'Sign Language',
  });
}
