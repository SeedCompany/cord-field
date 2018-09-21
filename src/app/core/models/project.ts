import { Engagement } from '@app/core/models/engagement';
import { DateTime } from 'luxon';
import { Language } from './language';
import { Location } from './location';
import { Partnership } from './partnership';
import { ProjectSensitivity } from './project/sensitivity';
import { ProjectStatus } from './project/status';
import { ProjectType } from './project/type';
import { TeamMember } from './team-member';
import { User } from './user';

export * from './project/status';
export * from './project/type';
export * from './project/sensitivity';

export class Project {

  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  location: Location | null;
  mouStart: DateTime | null;
  mouEnd: DateTime | null;
  languages: Language[];
  partnerships: Partnership[];
  sensitivity: ProjectSensitivity;
  team: TeamMember[];
  updatedAt: DateTime;
  estimatedSubmission: DateTime | null;
  engagements: Engagement[];

  static fromJson(json: any): Project {
    json = json || {};
    const project = new Project();

    project.id = json.id;
    project.name = (json.name || '')
    // Remove legacy IDs from project names, this should be removed before launch.
      .replace(/ \(\d+\)$/, '');
    project.type = json.type || ProjectType.Translation;
    project.status = json.status || ProjectStatus.Active;
    project.location = json.location ? Location.fromJson(json.location) : null;
    project.mouStart = json.mouStart ? DateTime.fromISO(json.mouStart) : null;
    project.mouEnd = json.mouEnd ? DateTime.fromISO(json.mouEnd) : null;
    project.languages = (json.languages || []).map(Language.fromJson);
    project.partnerships = (json.partnerships || []).map(Partnership.fromJson);
    project.sensitivity = json.sensitivity || 1;
    project.team = (json.team || []).map(TeamMember.fromJson);
    project.updatedAt = json.updatedAt ? DateTime.fromISO(json.updatedAt) : DateTime.fromMillis(0);
    project.estimatedSubmission = json.estimatedSubmission ? DateTime.fromISO(json.estimatedSubmission) : null;
    project.engagements = Engagement.fromJsonArray(json.engagements);

    return project;
  }

  static fromJsonArray(projects: any): Project[] {
    projects = projects || [];
    return projects.map(Project.fromJson);
  }

}

export interface ProjectFilter {
  type?: ProjectType;
  status?: ProjectStatus[];
  languages?: Language[];
  location?: Location[];
  team?: User[];
  sensitivity?: ProjectSensitivity[];
  dateRange?: string;
  startDate?: DateTime;
  endDate?: DateTime;
}

export interface ProjectsWithCount {
  projects: Project[];
  count: number;
}
