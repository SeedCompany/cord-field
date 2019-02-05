import { buildEnum } from '@app/core/models/enum';

export enum ProjectEngagementStatus {
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

export namespace ProjectEngagementStatus {
  const Enum = ProjectEngagementStatus;
  export const {entries, forUI, values, length, trackEntryBy, trackValueBy} = buildEnum<ProjectEngagementStatus>(Enum, {
    [Enum.Active]: 'Active',
    [Enum.Completed]: 'Completed',
    [Enum.Converted]: 'Converted',
    [Enum.InDevelopment]: 'In Development',
    [Enum.Rejected]: 'Rejected',
    [Enum.Suspended]: 'Suspended',
    [Enum.Terminated]: 'Terminated',
    [Enum.Unapproved]: 'Unapproved',
    [Enum.NotRenewed]: 'Not Renewed',
    [Enum.AwaitingDedication]: 'Awaiting Dedication',
    [Enum.Transferred]: 'Transferred',
  });
}
