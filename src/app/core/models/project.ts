import { ProjectBudget } from '@app/core/models/budget';
import { Engagement } from '@app/core/models/engagement';
import { ProjectExtension } from '@app/core/models/project/extension';
import { maybeRedacted } from '@app/core/util';
import { DateTime } from 'luxon';
import { Language } from './language';
import { Location } from './location';
import { Partnership } from './partnership';
import { ProjectSensitivity } from './project/sensitivity';
import { ProjectStatus } from './project/status';
import { ProjectType } from './project/type';
import { TeamMember } from './team-member';
import { User } from './user';

export * from './project/extension';
export * from './project/status';
export * from './project/type';
export * from './project/sensitivity';

export class Project {

  id: string;
  name: string;
  type: ProjectType;
  deptId: string | null;
  status: ProjectStatus;
  possibleStatuses: ProjectStatus[];
  location: Location | null;
  publicLocation: Location | null;
  mouStart: DateTime | null;
  mouEnd: DateTime | null;
  languages: Language[];
  partnerships: Partnership[];
  sensitivity: ProjectSensitivity;
  team: TeamMember[];
  budgets: ProjectBudget[];
  updatedAt: DateTime;
  estimatedSubmission: DateTime | null;
  engagements: Engagement[];
  extensions: ProjectExtension[];

  static fromJson(json: any): Project {
    json = json || {};
    const project = new Project();

    project.id = json.id;
    project.name = (json.name || '')
    // Remove legacy IDs from project names, this should be removed before launch.
      .replace(/ \(\d+\)$/, '');
    project.type = json.type || ProjectType.Translation;
    project.deptId = json.deptId;
    project.status = json.status || ProjectStatus.Active;
    project.possibleStatuses = json.possibleStatuses || [];
    project.location = json.location ? Location.fromJson(json.location) : null;
    project.publicLocation = json.publicLocation ? Location.fromJson(json.publicLocation) : null;
    project.mouStart = json.mouStart ? DateTime.fromISO(json.mouStart) : null;
    project.mouEnd = json.mouEnd ? DateTime.fromISO(json.mouEnd) : null;
    project.languages = (json.languages || []).map(Language.fromJson);
    project.partnerships = (json.partnerships || []).map(Partnership.fromJson);
    project.sensitivity = json.sensitivity || 1;
    project.team = (json.team || []).map(TeamMember.fromJson);
    project.updatedAt = json.updatedAt ? DateTime.fromISO(json.updatedAt) : DateTime.fromMillis(0);
    project.estimatedSubmission = json.estimatedSubmission ? DateTime.fromISO(json.estimatedSubmission) : null;
    project.engagements = (maybeRedacted(json.engagements) || []).map(Engagement.fromJson);
    project.budgets = (json.budgets || []).map((b: any) => ProjectBudget.fromJson(project, b));
    project.extensions = (json.extensions || []).map(ProjectExtension.fromJson);

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
