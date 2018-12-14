import { buildEnum } from '@app/core/models/enum';

export enum ProjectStatus {
  EarlyConversations = 'early_conversations',
  PendingConceptApproval = 'pending_concept_approval',
  PrepForConsultantEndorsement = 'dev_for_consultant_review',
  PendingConsultantEndorsement = 'pending_consultant_endorsement',
  PrepForFinancialEndorsement = 'dev_for_financial_endorsement',
  PendingFinancialEndorsement = 'pending_financial_analyst_endorsement',
  FinalizingProposal = 'finalizingProposal',
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

export namespace ProjectStatus {
  export const { entries, forUI, values, trackEntryBy, trackValueBy } = buildEnum(ProjectStatus, {
    [ProjectStatus.EarlyConversations]: 'Early Conversations',
    [ProjectStatus.PendingConceptApproval]: 'Pending Concept Approval',
    [ProjectStatus.PrepForConsultantEndorsement]: 'Prep for Consultant Endorsement',
    [ProjectStatus.PendingConsultantEndorsement]: 'Pending Consultant Endorsement',
    [ProjectStatus.PrepForFinancialEndorsement]: 'Prep for Financial Endorsement',
    [ProjectStatus.PendingFinancialEndorsement]: 'Pending Financial Endorsement',
    [ProjectStatus.FinalizingProposal]: 'Finalizing Proposal',
    [ProjectStatus.PendingAreaDirectorApproval]: 'Pending Area Director Approval',
    [ProjectStatus.PendingRegionalDirectorApproval]: 'Pending Regional Director Approval',
    [ProjectStatus.PendingFinanceConfirmation]: 'Pending Finance Confirmation',
    [ProjectStatus.OnHoldFinanceConfirmation]: 'On Hold for Finance Confirmation',
    [ProjectStatus.DidNotDevelop]: 'Did Not Develop',
    [ProjectStatus.Active]: 'Active',
    [ProjectStatus.Rejected]: 'Rejected',
    [ProjectStatus.Suspended]: 'Suspended',
    [ProjectStatus.Terminated]: 'Terminated',
    [ProjectStatus.Completed]: 'Completed',
  });

  export function getColor(status: ProjectStatus) {
    if (ProjectStatus.Grouping.Active.includes(status)) {
      return 'active';
    }
    if (ProjectStatus.Grouping.InDevelopment.includes(status)) {
      return 'dev';
    }
    if (ProjectStatus.Grouping.Pending.includes(status)) {
      return 'pending';
    }
    if (ProjectStatus.Grouping.Stopped.includes(status)) {
      return 'stopped';
    }
    if (ProjectStatus.Grouping.Finished.includes(status)) {
      return 'finished';
    }
  }
  export namespace Grouping {
    export const InDevelopment = [
      ProjectStatus.EarlyConversations,
      ProjectStatus.PrepForConsultantEndorsement,
      ProjectStatus.PrepForFinancialEndorsement,
      ProjectStatus.FinalizingProposal,
    ];
    export const Pending = [
      ProjectStatus.PendingConceptApproval,
      ProjectStatus.PendingConsultantEndorsement,
      ProjectStatus.PendingFinancialEndorsement,
      ProjectStatus.PendingAreaDirectorApproval,
      ProjectStatus.PendingRegionalDirectorApproval,
      ProjectStatus.PendingFinancialEndorsement,
      ProjectStatus.OnHoldFinanceConfirmation,
    ];
    export const Active = [
      ProjectStatus.Active,
    ];
    export const Stopped = [
      ProjectStatus.Suspended,
      ProjectStatus.Rejected,
      ProjectStatus.Terminated,
    ];
    export const Finished = [
      ProjectStatus.DidNotDevelop,
      ProjectStatus.Completed,
    ];
  }
}
