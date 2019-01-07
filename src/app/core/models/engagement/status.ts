import { buildEnum } from '@app/core/models/enum';

export enum EngagementStatus {
  Active = 'active',
  Completed = 'completed',
  Converted = 'converted',
  InDevelopment = 'in_development',
  Rejected = 'rejected',
  Suspended = 'suspended',
  Terminated = 'terminated',
  Unapproved = 'unapproved',
  NotRenewed = 'not_renewed',
  AwaitingDedication = 'awaiting_dedication',
  Transferred = 'transferred',
}

export namespace EngagementStatus {
  export const {entries, forUI, values, length, trackEntryBy, trackValueBy} = buildEnum(EngagementStatus, {
    [EngagementStatus.Active]: 'Active',
    [EngagementStatus.Completed]: 'Completed',
    [EngagementStatus.Converted]: 'Converted',
    [EngagementStatus.InDevelopment]: 'In Development',
    [EngagementStatus.Rejected]: 'Rejected',
    [EngagementStatus.Suspended]: 'Suspended',
    [EngagementStatus.Terminated]: 'Terminated',
    [EngagementStatus.Unapproved]: 'Unapproved',
    [EngagementStatus.NotRenewed]: 'Not Renewed',
    [EngagementStatus.AwaitingDedication]: 'Awaiting Dedication',
    [EngagementStatus.Transferred]: 'Transferred',
  });
}
