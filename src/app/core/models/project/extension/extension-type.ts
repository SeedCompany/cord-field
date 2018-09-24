import { buildEnum } from '@app/core/models/enum';

export enum ExtensionType {
  Time = 'time',
  Language = 'language',
  Budget = 'budget'
}

export namespace ExtensionType {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ExtensionType, {
    [ExtensionType.Time]: 'Time',
    [ExtensionType.Language]: 'Language',
    [ExtensionType.Budget]: 'Budget'
  });
}
