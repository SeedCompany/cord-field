import { buildEnum } from '@app/core/models/enum';

export enum EngagementStatus {
  Active = 'active',
  Completed = 'completed',
  Converted = 'converted',
  InDevelopment = 'indevelopment',
  Rejected = 'rejected',
  Suspended = 'suspended',
  Terminated = 'terminated',
}

export namespace EngagementStatus {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(EngagementStatus, {
    [EngagementStatus.Active]: 'Active',
    [EngagementStatus.Completed]: 'Completed',
    [EngagementStatus.Converted]: 'Converted',
    [EngagementStatus.InDevelopment]: 'In Development',
    [EngagementStatus.Rejected]: 'Rejected',
    [EngagementStatus.Suspended]: 'Suspended',
    [EngagementStatus.Terminated]: 'Terminated',
  });
}
