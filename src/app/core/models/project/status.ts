import { buildEnum } from '@app/core/models/enum';

export enum ProjectStatus {
  Active = 'active',
  InDevelopment = 'in_development',
  PendingApproval = 'pending_approval',
  Rejected = 'rejected',
  Suspended = 'suspended',
  Terminated = 'terminated',
  Completed = 'completed'
}

export namespace ProjectStatus {
  export const { entries, forUI, values, trackEntryBy, trackValueBy } = buildEnum(ProjectStatus, {
    [ProjectStatus.Active]: 'Active',
    [ProjectStatus.InDevelopment]: 'In Development',
    [ProjectStatus.PendingApproval]: 'Pending Approval',
    [ProjectStatus.Rejected]: 'Rejected',
    [ProjectStatus.Suspended]: 'Suspended',
    [ProjectStatus.Terminated]: 'Terminated',
    [ProjectStatus.Completed]: 'Completed'
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
  FinanceConfirmation = 'finance_confirmation'
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
    [ProjectStage.FinanceConfirmation]: 'Finance Confirmation'
  });

  export function forStatus(status: ProjectStatus): ProjectStage[] {
    const mapping: { [key: string]: ProjectStage[] } = {
      [ProjectStatus.Active]: [
        ProjectStage.InProgress,
        ProjectStage.PendingSuspension,
        ProjectStage.PendingTermination,
        ProjectStage.PendingCompletion,
        ProjectStage.CompletedActive
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
        ProjectStage.FinanceConfirmation
      ]
    };
    return mapping[status];
  }
}
