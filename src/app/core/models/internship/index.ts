import { Budget } from '@app/core/models/budget';
import { Location } from '@app/core/models/location';
import { Partnership } from '@app/core/models/partnership';
import { Sensitivity } from '@app/core/models/sensitivity';
import { TeamMember } from '@app/core/models/team-member';
import { User } from '@app/core/models/user';
import { ifValue, maybeRedacted, maybeServerDate, maybeServerDateTime } from '@app/core/util';
import { DateFilter } from '@app/core/util/list-filters';
import { DateTime } from 'luxon';
import { InternshipEngagement } from './engagement';
import { InternshipStatus } from './status';

export * from './engagement';
export * from './list-item';
export * from './status';

export class EditableInternship {
  name: string;
  status: InternshipStatus;
  location: Location | null;
  mouStart: DateTime | null;
  mouEnd: DateTime | null;
  partnerships: Partnership[];
  sensitivity: Sensitivity;
  team: TeamMember[];
  budgets: Budget[];
  estimatedSubmission: DateTime | null;
  engagements: InternshipEngagement[];
}

export class Internship extends EditableInternship {
  id: string;
  deptId: string | null;
  possibleStatuses: InternshipStatus[];
  publicLocation: Location | null;
  updatedAt: DateTime;

  static fromJson(json: any | Partial<Internship> /* give hints to IDE but don't enforce types */): Internship {
    json = json || {};
    const project = new Internship();

    project.id = json.id;
    project.name = json.name;
    project.deptId = json.deptId;
    project.status = json.status || InternshipStatus.Active;
    project.possibleStatuses = json.possibleStatuses || [];
    project.location = ifValue(json.location, Location.fromJson, null);
    project.publicLocation = ifValue(json.publicLocation, Location.fromJson, null);
    project.mouStart = maybeServerDate(json.mouStart);
    project.mouEnd = maybeServerDate(json.mouEnd);
    project.partnerships = (json.partnerships || []).map(Partnership.fromJson);
    project.sensitivity = json.sensitivity || Sensitivity.Low;
    project.team = (json.team || []).map(TeamMember.fromJson);
    project.updatedAt = maybeServerDateTime(json.updatedAt) || DateTime.fromMillis(0);
    project.estimatedSubmission = maybeServerDate(json.estimatedSubmission);
    project.engagements = (maybeRedacted(json.engagements) || []).map(InternshipEngagement.fromJson);
    project.budgets = (json.budgets || []).map((b: any) => Budget.fromJson(project, b));

    return project;
  }
}

export interface InternshipFilter extends DateFilter {
  status?: InternshipStatus[];
  location?: Location[];
  team?: User[];
  sensitivity?: Sensitivity[];
}
