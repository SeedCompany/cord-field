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

export class Project {

  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  updatedAt: Date;
  languages: string[];

  static fromJson(json: any): Project {
    json = json || {};
    const project = new Project();

    project.id = json.id;
    project.name = json.name || '';
    project.type = json.type || ProjectType.Translation;
    project.languages = json.languages || [];
    project.updatedAt = json.updatedAt ? new Date(json.updatedAt) : null;
    project.status = json.status || ProjectStatus.Active;

    return project;
  }

  static fromJsonArray(projects: any): Project[] {
    projects = projects || [];
    return projects.map(project => this.fromJson(project));
  }

}
