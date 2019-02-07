import { buildEnum } from '@app/core/models/enum';

export enum ExtensionType {
  Time = 'time',
  Language = 'language',
  Budget = 'budget',
}

export namespace ExtensionType {
  const Enum = ExtensionType;
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum<ExtensionType>(Enum, {
    [Enum.Time]: 'Time',
    [Enum.Language]: 'Language',
    [Enum.Budget]: 'Budget',
  });
}
