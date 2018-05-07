import { buildEnum } from './enum';
import { Language } from './language';
import { Location } from './location';

export enum ProjectType {
  Translation = 'translation',
  Internship = 'internship'
}
export namespace ProjectType {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProjectType, {
    [ProjectType.Translation]: 'Translation',
    [ProjectType.Internship]: 'Internship'
  });
}

export enum ProjectStatus {
  Active = 'active',
  Inactive = 'inactive',
  InDevelopment = 'in_development'
}
export namespace ProjectStatus {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProjectStatus, {
    [ProjectStatus.Active]: 'Active',
    [ProjectStatus.Inactive]: 'Inactive',
    [ProjectStatus.InDevelopment]: 'In Development'
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
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProjectStage, {
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
    const mapping = {
      [ProjectStatus.Active]: [
        ProjectStage.InProgress,
        ProjectStage.PendingSuspension,
        ProjectStage.PendingTermination,
        ProjectStage.PendingCompletion,
        ProjectStage.CompletedActive
      ],
      [ProjectStatus.Inactive]: [
        ProjectStage.Suspended,
        ProjectStage.Terminated,
        ProjectStage.CompletedInactive
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

export type ProjectSensitivity = 1 | 2 | 3;
export const ProjectSensitivities = [1, 2, 3];

export class Project {

  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  location: Location | null;
  startDate: Date | null;
  endDate: Date | null;
  languages: Language[];
  sensitivity: ProjectSensitivity;
  updatedAt: Date;

  static fromJson(json: any): Project {
    json = json || {};
    const project = new Project();

    project.id = json.id;
    project.name = json.name || '';
    project.type = json.type || ProjectType.Translation;
    project.status = json.status || ProjectStatus.Active;
    project.location = json.location ? Location.fromJson(json.location) : null;
    project.startDate = json.startDate ? new Date(json.startDate) : null;
    project.endDate = json.endDate ? new Date(json.endDate) : null;
    project.languages = (json.languages || []).map(Language.fromJson);
    project.sensitivity = json.sensitivity || 1;
    project.updatedAt = new Date(json.updatedAt || 0);

    return project;
  }

  static fromJsonArray(projects: any): Project[] {
    projects = projects || [];
    return projects.map(Project.fromJson);
  }

}

export interface ProjectsWithCount {
  projects: Project[];
  count: number;
}

