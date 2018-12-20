import { buildEnum } from '@app/core/models/enum';

export enum ExtensionStatus {
  Draft = 'processStarted',
  Review = 'review',
  ApprovalPending = 'approvalPending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export namespace ExtensionStatus {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ExtensionStatus, {
    [ExtensionStatus.Draft]: 'Draft',
    [ExtensionStatus.Review]: 'Review',
    [ExtensionStatus.ApprovalPending]: 'Approval Pending',
    [ExtensionStatus.Approved]: 'Approved',
    [ExtensionStatus.Rejected]: 'Rejected',
  });
}
