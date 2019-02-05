import { Budget } from '@app/core/models/budget';
import { Language } from '@app/core/models/language';
import { Location } from '@app/core/models/location';
import { Partnership } from '@app/core/models/partnership';
import { Sensitivity } from '@app/core/models/sensitivity';
import { TeamMember } from '@app/core/models/team-member';
import { User } from '@app/core/models/user';
import { maybeRedacted } from '@app/core/util';
import { DateFilter } from '@app/core/util/list-filters';
import { DateTime } from 'luxon';
import { ProjectEngagement } from './engagement';
import { ProjectExtension } from './extension';
import { ProjectStatus } from './status';

export * from './engagement';
export * from './extension';
export * from './status';

export class Project {

  id: string;
  name: string;
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
  engagements: ProjectEngagement[];
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
    project.engagements = (maybeRedacted(json.engagements) || []).map(ProjectEngagement.fromJson);
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
