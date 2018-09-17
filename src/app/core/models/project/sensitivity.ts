import { buildEnum } from '@app/core/models/enum';

export enum ProjectSensitivity {
  Low = 1,
  Medium = 2,
  High = 3
}

export namespace ProjectSensitivity {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProjectSensitivity, {
    [ProjectSensitivity.Low]: 'Low',
    [ProjectSensitivity.Medium]: 'Medium',
    [ProjectSensitivity.High]: 'High'
  });
}
