import { buildEnum } from '@app/core/models/enum';

export enum LanguageProficiency {
  Beginner = 'beginner',
  Conversational = 'conversational',
  Skilled = 'skilled',
  Fluent = 'fluent',
}

export namespace LanguageProficiency {
  const Enum = LanguageProficiency;
  export const { entries, forUI, values, trackEntryBy, trackValueBy } = buildEnum<LanguageProficiency>(Enum, {
    [Enum.Beginner]: 'Beginner',
    [Enum.Conversational]: 'Conversational',
    [Enum.Skilled]: 'Skilled',
    [Enum.Fluent]: 'Fluent',
  });
}
