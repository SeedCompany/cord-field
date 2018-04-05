export interface IProject {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  updatedAt: Timestamp;
  languages: string[];
}

export enum ProjectType { Translation, Internship }

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
  Active,
  Inactive,
  InDevelopment,
  Completed,
  Rejected
}

export function projectStatusToString(value: ProjectStatus): string {
  const mapping = {
    [ProjectStatus.Active]: 'Active',
    [ProjectStatus.Inactive]: 'Inactive',
    [ProjectStatus.InDevelopment]: 'In Development',
    [ProjectStatus.Completed]: 'Completed',
    [ProjectStatus.Rejected]: 'Rejected'
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
  updatedAt: Timestamp;
  languages: string[];


  static fromJson(json: any): Project {
    json = json || {};
    const project = new Project();

    project.id = json.id;
    project.name = json.name || '';
    project.type = json.type || ProjectType.Translation;
    project.languages = json.languages || [];
    project.updatedAt = json.updatedAt || '2018-03-28T14:33:13.559Z';
    project.status = json.status || ProjectStatus.Active;

    return project;
  }
}
