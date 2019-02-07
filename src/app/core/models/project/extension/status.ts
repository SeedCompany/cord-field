import { buildEnum } from '@app/core/models/enum';

export enum ExtensionStatus {
  Draft = 'processStarted',
  Review = 'review',
  ApprovalPending = 'approvalPending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export namespace ExtensionStatus {
  const Enum = ExtensionStatus;
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum<ExtensionStatus>(Enum, {
    [Enum.Draft]: 'Draft',
    [Enum.Review]: 'Review',
    [Enum.ApprovalPending]: 'Approval Pending',
    [Enum.Approved]: 'Approved',
    [Enum.Rejected]: 'Rejected',
  });
}
