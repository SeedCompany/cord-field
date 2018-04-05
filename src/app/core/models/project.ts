<<<<<<< HEAD
export enum ProjectType {
  Translation = 'translation',
  Internship = 'internship'
=======
export interface IProject {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  updatedAt: Timestamp;
  languages: string[];
>>>>>>> CF2- mock data removed , service call added
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

/**
 * A string representation of a date.
 *
 * Example: "2018-09-30T05:00:00.000Z"
 */
export type Timestamp = string;

export class Project {

  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
<<<<<<< HEAD
  updatedAt: Date;
=======
  updatedAt: Timestamp;
>>>>>>> CF2- mock data removed , service call added
  languages: string[];


  static fromJson(json: any): Project {
    json = json || {};
    const project = new Project();

    project.id = json.id;
    project.name = json.name || '';
    project.type = json.type || ProjectType.Translation;
    project.languages = json.languages || [];
<<<<<<< HEAD
    project.updatedAt = json.updatedAt ? new Date(json.updatedAt) : new Date();
=======
    project.updatedAt = json.updatedAt || '2018-03-28T14:33:13.559Z';
>>>>>>> CF2- mock data removed , service call added
    project.status = json.status || ProjectStatus.Active;

    return project;
  }
<<<<<<< HEAD

  static fromJsonArray(projects: any): Project[] {
    projects = projects || [];
    return projects.map(project => this.fromJson(project));
  }

=======
>>>>>>> CF2- mock data removed , service call added
}
