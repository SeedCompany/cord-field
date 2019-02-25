import { buildEnum } from '@app/core/models/enum';

export enum Degree {
  Primary = 'primary',
  Secondary = 'secondary',
  Associates = 'associates',
  Bachelors = 'bachelors',
  Masters = 'masters',
  Doctorate = 'doctorate',
}

export namespace Degree {
  const Enum = Degree;
  export const { entries, forUI, values, trackEntryBy, trackValueBy } = buildEnum<Degree>(Enum, {
    [Enum.Primary]: 'Primary',
    [Enum.Secondary]: 'Secondary',
    [Enum.Associates]: 'Associate\'s',
    [Enum.Bachelors]: 'Bachelor\'s',
    [Enum.Masters]: 'Master\'s',
    [Enum.Doctorate]: 'Doctorate',
  });
}
