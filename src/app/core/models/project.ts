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
    project.updatedAt = json.updatedAt ? new Date(json.updatedAt) : null;
    project.status = json.status || ProjectStatus.Active;
    project.sensitivity = json.sensitivity || 1;

    return project;
  }

  static fromJsonArray(projects: any): Project[] {
    projects = projects || [];
    return projects.map(project => this.fromJson(project));
  }

}

export interface ProjectsWithCount {
  projects: Project[];
  count: number;
}


export function getProjectStages(value: ProjectStatus): string[] {
  const mapping = {
    [ProjectStatus.InDevelopment]: [
      'Concept Development',
      'Concept Approval',
      'Plan Development',
      'Consultant Review',
      'Budget Development',
      'Financial Analyst Endorsement',
      'Proposal Completion',
      'Project Approval',
      'Finance Confirmation'],
    [ProjectStatus.Active]: [
      'In Progress',
      'Pending Suspension',
      'Pending Termination',
      'Pending Completion',
      'Completed Active'
    ],
    [ProjectStatus.Inactive]: [
      'Suspended',
      'Terminated',
      'Completed Inactive'
    ]
  };
  return mapping[value];
}

