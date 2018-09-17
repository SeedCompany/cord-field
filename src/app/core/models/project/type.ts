import { buildEnum } from '@app/core/models/enum';

export enum ProjectType {
  Translation = 'translation',
  Internship = 'internship'
}

export namespace ProjectType {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProjectType, {
    [ProjectType.Translation]: 'Translation',
    [ProjectType.Internship]: 'Internship'
  });
}
