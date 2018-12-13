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
}

export enum ProjectStage {
  InProgress = 'in_progress',
  PendingSuspension = 'pending_suspension',
  PendingTermination = 'pending_termination',
  PendingCompletion = 'pending_completion',
  CompletedActive = 'completed_active',
  Suspended = 'suspended',
  Terminated = 'terminated',
  CompletedInactive = 'completed_inactive',
  ConceptDevelopment = 'concept_development',
  ConceptApproval = 'concept_approval',
  PlanDevelopment = 'plan_development',
  ConsultantReview = 'consultant_review',
  BudgetDevelopment = 'budget_development',
  FinancialAnalystEndorsement = 'financial_analyst_endorsement',
  ProposalCompletion = 'proposal_completion',
  ProjectApproval = 'project_approval',
  FinanceConfirmation = 'finance_confirmation',
}

export namespace ProjectStage {
  export const { entries, forUI, values, trackEntryBy, trackValueBy } = buildEnum(ProjectStage, {
    [ProjectStage.InProgress]: 'In Progress',
    [ProjectStage.PendingSuspension]: 'Pending Suspension',
    [ProjectStage.PendingTermination]: 'Pending Termination',
    [ProjectStage.PendingCompletion]: 'Pending Completion',
    [ProjectStage.CompletedActive]: 'Completed Active',
    [ProjectStage.Suspended]: 'Suspended',
    [ProjectStage.Terminated]: 'Terminated',
    [ProjectStage.CompletedInactive]: 'Completed Inactive',
    [ProjectStage.ConceptDevelopment]: 'Concept Development',
    [ProjectStage.ConceptApproval]: 'Concept Approval',
    [ProjectStage.PlanDevelopment]: 'Plan Development',
    [ProjectStage.ConsultantReview]: 'Consultant Review',
    [ProjectStage.BudgetDevelopment]: 'Budget Development',
    [ProjectStage.FinancialAnalystEndorsement]: 'Financial Analyst Endorsement',
    [ProjectStage.ProposalCompletion]: 'Proposal Completion',
    [ProjectStage.ProjectApproval]: 'Project Approval',
    [ProjectStage.FinanceConfirmation]: 'Finance Confirmation',
  });

  export function forStatus(status: ProjectStatus): ProjectStage[] {
    const mapping: { [key: string]: ProjectStage[] } = {
      [ProjectStatus.Active]: [
        ProjectStage.InProgress,
        ProjectStage.PendingSuspension,
        ProjectStage.PendingTermination,
        ProjectStage.PendingCompletion,
        ProjectStage.CompletedActive,
      ],
      [ProjectStatus.InDevelopment]: [
        ProjectStage.ConceptDevelopment,
        ProjectStage.ConceptApproval,
        ProjectStage.PlanDevelopment,
        ProjectStage.ConsultantReview,
        ProjectStage.BudgetDevelopment,
        ProjectStage.FinancialAnalystEndorsement,
        ProjectStage.ProposalCompletion,
        ProjectStage.ProjectApproval,
        ProjectStage.FinanceConfirmation,
      ],
    };
    return mapping[status];
  }
}
