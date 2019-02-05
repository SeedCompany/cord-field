import { buildEnum } from '@app/core/models/enum';

export enum Sensitivity {
  Low = 1,
  Medium = 2,
  High = 3,
}

export namespace Sensitivity {
  const Enum = Sensitivity;
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum<Sensitivity>(Enum, {
    [Enum.Low]: 'Low',
    [Enum.Medium]: 'Medium',
    [Enum.High]: 'High',
  });
}
