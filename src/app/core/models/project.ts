import { Budget } from '@app/core/models/budget';
import { Engagement } from '@app/core/models/engagement';
import { ProjectExtension } from '@app/core/models/project/extension';
import { Sensitivity } from '@app/core/models/sensitivity';
import { maybeRedacted } from '@app/core/util';
import { DateFilter } from '@app/core/util/list-filters';
import { DateTime } from 'luxon';
import { Language } from './language';
import { Location } from './location';
import { Partnership } from './partnership';
import { ProjectStatus } from './project/status';
import { ProjectType } from './project/type';
import { TeamMember } from './team-member';
import { User } from './user';

export * from './project/extension';
export * from './project/status';
export * from './project/type';

export class Project {

  id: string;
  name: string;
  type = ProjectType.Translation; // Hard code for now since we reference it still
  deptId: string | null;
  status: ProjectStatus;
  possibleStatuses: ProjectStatus[];
  location: Location | null;
  publicLocation: Location | null;
  mouStart: DateTime | null;
  mouEnd: DateTime | null;
  languages: Language[];
  partnerships: Partnership[];
  sensitivity: Sensitivity;
  team: TeamMember[];
  budgets: Budget[];
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
    project.deptId = json.deptId;
    project.status = json.status || ProjectStatus.Active;
    project.possibleStatuses = json.possibleStatuses || [];
    project.location = json.location ? Location.fromJson(json.location) : null;
    project.publicLocation = json.publicLocation ? Location.fromJson(json.publicLocation) : null;
    project.mouStart = json.mouStart ? DateTime.fromISO(json.mouStart) : null;
    project.mouEnd = json.mouEnd ? DateTime.fromISO(json.mouEnd) : null;
    project.languages = (json.languages || []).map(Language.fromJson);
    project.partnerships = (json.partnerships || []).map(Partnership.fromJson);
    project.sensitivity = json.sensitivity || Sensitivity.Low;
    project.team = (json.team || [])
      .filter((tm: any) => tm.user) // ignore team members that don't have user hydrated
      .map(TeamMember.fromJson);
    project.updatedAt = json.updatedAt ? DateTime.fromISO(json.updatedAt) : DateTime.fromMillis(0);
    project.estimatedSubmission = json.estimatedSubmission ? DateTime.fromISO(json.estimatedSubmission) : null;
    project.engagements = (maybeRedacted(json.engagements) || []).map(Engagement.fromJson);
    project.budgets = (json.budgets || []).map((b: any) => Budget.fromJson(project, b));
    project.extensions = (json.extensions || []).map(ProjectExtension.fromJson);

    return project;
  }
}

export interface ProjectFilter extends DateFilter {
  status?: ProjectStatus[];
  languages?: Language[];
  location?: Location[];
  team?: User[];
  sensitivity?: Sensitivity[];
}
