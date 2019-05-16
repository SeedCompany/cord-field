import { buildEnum } from '@app/core/models/enum';

export enum InternshipStatus {
  EarlyConversations = 'early_conversations',
  PendingConceptApproval = 'pending_concept_approval',
  PrepForMentorEndorsement = 'dev_for_mentor_review',
  PendingMentorEndorsement = 'pending_mentor_endorsement',
  PrepForFinancialEndorsement = 'dev_for_financial_endorsement',
  PendingFinancialEndorsement = 'pending_financial_analyst_endorsement',
  FinalizingProposal = 'finalizing_proposal',
  PendingAreaDirectorApproval = 'pending_ad_approval',
  PendingRegionalDirectorApproval = 'pending_rd_approval',
  PendingFinanceConfirmation = 'pending_finance_confirmation',
  OnHoldFinanceConfirmation = 'on_hold_finance_confirmation',
  DidNotDevelop = 'did_not_develop',
  Active = 'active',
  Rejected = 'rejected',
  Suspended = 'suspended',
  Terminated = 'terminated',
  Completed = 'completed',
}

export namespace InternshipStatus {
  const Enum = InternshipStatus;
  export const { entries, forUI, values, length, trackEntryBy, trackValueBy } = buildEnum<InternshipStatus>(Enum, {
    [Enum.EarlyConversations]: 'Early Conversations',
    [Enum.PendingConceptApproval]: 'Pending Concept Approval',
    [Enum.PrepForMentorEndorsement]: 'Prep for Mentor Endorsement',
    [Enum.PendingMentorEndorsement]: 'Pending Mentor Endorsement',
    [Enum.PrepForFinancialEndorsement]: 'Prep for Financial Endorsement',
    [Enum.PendingFinancialEndorsement]: 'Pending Financial Endorsement',
    [Enum.FinalizingProposal]: 'Finalizing Proposal',
    [Enum.PendingAreaDirectorApproval]: 'Pending Area Director Approval',
    [Enum.PendingRegionalDirectorApproval]: 'Pending Regional Director Approval',
    [Enum.PendingFinanceConfirmation]: 'Pending Finance Confirmation',
    [Enum.OnHoldFinanceConfirmation]: 'On Hold for Finance Confirmation',
    [Enum.DidNotDevelop]: 'Did Not Develop',
    [Enum.Active]: 'Active',
    [Enum.Rejected]: 'Rejected',
    [Enum.Suspended]: 'Suspended',
    [Enum.Terminated]: 'Terminated',
    [Enum.Completed]: 'Completed',
  });

  export function getColor(status: InternshipStatus) {
    if (Enum.Grouping.Active.includes(status)) {
      return 'active';
    }
    if (Enum.Grouping.InDevelopment.includes(status)) {
      return 'dev';
    }
    if (Enum.Grouping.Pending.includes(status)) {
      return 'pending';
    }
    if (Enum.Grouping.Stopped.includes(status)) {
      return 'stopped';
    }
    if (Enum.Grouping.Finished.includes(status)) {
      return 'finished';
    }
  }
  export namespace Grouping {
    export const InDevelopment = [
      Enum.EarlyConversations,
      Enum.PrepForMentorEndorsement,
      Enum.PrepForFinancialEndorsement,
      Enum.FinalizingProposal,
    ];
    export const Pending = [
      Enum.PendingConceptApproval,
      Enum.PendingMentorEndorsement,
      Enum.PendingFinancialEndorsement,
      Enum.PendingAreaDirectorApproval,
      Enum.PendingRegionalDirectorApproval,
      Enum.PendingFinancialEndorsement,
      Enum.OnHoldFinanceConfirmation,
    ];
    export const Active = [
      Enum.Active,
    ];
    export const Stopped = [
      Enum.Suspended,
      Enum.Rejected,
      Enum.Terminated,
    ];
    export const Finished = [
      Enum.DidNotDevelop,
      Enum.Completed,
    ];
  }
}
