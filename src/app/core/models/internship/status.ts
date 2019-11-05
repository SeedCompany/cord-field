import { buildEnum } from '@app/core/models/enum';

export enum InternshipStatus {
  EarlyConversations = 'early_conversations',
  PendingConceptApproval = 'pending_concept_approval',
  PrepForGrowthPlanEndorsement = 'prep_for_growth_plan_endorsement',
  PendingGrowthPlanEndorsement = 'pending_growth_plan_endorsement',
  PrepForFinancialEndorsement = 'prep_for_financial_endorsement',
  PendingFinancialEndorsement = 'pending_financial_analyst_endorsement',
  FinalizingProposal = 'finalizing_proposal',
  PendingRegionalDirectorApproval = 'pending_ad_approval',
  PendingFieldOperationsDirectorApproval = 'pending_rd_approval',
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
    [Enum.PrepForGrowthPlanEndorsement]: 'Prep for Growth Plan Endorsement',
    [Enum.PendingGrowthPlanEndorsement]: 'Pending Growth Plan Endorsement',
    [Enum.PrepForFinancialEndorsement]: 'Prep for Financial Endorsement',
    [Enum.PendingFinancialEndorsement]: 'Pending Financial Endorsement',
    [Enum.FinalizingProposal]: 'Finalizing Proposal',
    [Enum.PendingRegionalDirectorApproval]: 'Pending Regional Director Approval',
    [Enum.PendingFieldOperationsDirectorApproval]: 'Pending Field Operations Director Approval',
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
      Enum.PrepForGrowthPlanEndorsement,
      Enum.PrepForFinancialEndorsement,
      Enum.FinalizingProposal,
    ];
    export const Pending = [
      Enum.PendingConceptApproval,
      Enum.PendingGrowthPlanEndorsement,
      Enum.PendingFinancialEndorsement,
      Enum.PendingRegionalDirectorApproval,
      Enum.PendingFieldOperationsDirectorApproval,
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
