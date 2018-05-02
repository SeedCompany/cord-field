export enum ProjectType {
  Translation = 'translation',
  Internship = 'internship'
}

export const projectTypeList = [
  ProjectType.Translation,
  ProjectType.Internship
];

export function projectTypeToString(value: ProjectType): string {
  const mapping = {
    [ProjectType.Translation]: 'Translation',
    [ProjectType.Internship]: 'Internship'
  };

  return mapping[value];
}

export enum ProjectStatus {
  Active = 'active',
  Inactive = 'inactive',
  InDevelopment = 'in_development'
}

export function projectStatusToString(value: ProjectStatus): string {
  const mapping = {
    [ProjectStatus.Active]: 'Active',
    [ProjectStatus.Inactive]: 'Inactive',
    [ProjectStatus.InDevelopment]: 'In Development'
  };
  return mapping[value];
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


export function projectStagesForStatus(value: ProjectStatus) {
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
  return mapping[value];
}

export function projectStageToString(projectStage: ProjectStage) {
  const mapping = {
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
  };
  return mapping[projectStage];
}

export type ProjectSensitivity = 1 | 2 | 3;
export const ProjectSensitivities = [1, 2, 3];

export class Project {

  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  updatedAt: Date;
  languages: string[];
  sensitivity: ProjectSensitivity;

  static fromJson(json: any): Project {
    json = json || {};
    const project = new Project();

    project.id = json.id;
    project.name = json.name || '';
    project.type = json.type || ProjectType.Translation;
    project.languages = json.languages || [];
    project.updatedAt = new Date(json.updatedAt);
    project.status = json.status || ProjectStatus.Active;
    project.sensitivity = json.sensitivity || 1;

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

