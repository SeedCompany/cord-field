import { Injectable } from '@angular/core';
import { Budget } from '@app/core/models/budget';
import { ProjectEngagement as Engagement } from '@app/core/models/project';
import { SessionStorageService } from '@app/core/services/storage.service';
import { clone } from '@app/core/util';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AbstractViewState, SaveResult } from '../core/abstract-view-state';
import { ChangeConfig, dateConfig, mapChangeList, returnId, returnSelf } from '../core/change-engine';
import { Language } from '../core/models/language';
import { Location } from '../core/models/location';
import { Partnership, PartnershipForSaveAPI } from '../core/models/partnership';
import { Project, ProjectExtension, ProjectStatus } from '../core/models/project';
import { TeamMember, TeamMemberForSaveAPI } from '../core/models/team-member';
import { ProjectService } from '../core/services/project.service';

export interface ModifiedProject {
  mouStart?: DateTime;
  mouEnd?: DateTime;
  estimatedSubmission?: DateTime;
  status?: ProjectStatus;
  locationId?: string;
  languages?: {
    add?: string[];
    remove?: string[];
  };
  partnerships?: {
    add?: PartnershipForSaveAPI[];
    update?: PartnershipForSaveAPI[];
    remove?: string[];
  };
  team?: {
    add?: TeamMemberForSaveAPI[];
    update?: TeamMemberForSaveAPI[];
    remove?: string[];
  };
  budgets?: Budget[];
}

const config: ChangeConfig<Project> = {
  name: {},
  mouStart: {
    ...dateConfig,
    forceRefresh: true,
  },
  mouEnd: {
    ...dateConfig,
    forceRefresh: true,
  },
  estimatedSubmission: {
    ...dateConfig,
  },
  status: {
    forceRefresh: true, // Status changes engagement statuses
  },
  location: {
    accessor: returnId,
    toServer: returnId,
    key: 'locationId',
    forceRefresh: true,
    restore: Location.fromJson,
  },
  languages: {
    accessor: returnId,
    toServer: mapChangeList<Language, string, string>(returnId, returnId),
    forceRefresh: true, // Languages changes engagements
    store: mapChangeList(returnSelf, returnSelf),
    restore: mapChangeList(Language.fromJson, Language.fromJson),
  },
  partnerships: {
    accessor: returnId,
    toServer: mapChangeList<Partnership, PartnershipForSaveAPI, string>(Partnership.forSaveAPI, returnId),
    forceRefresh: true,
    store: mapChangeList(Partnership.store, Partnership.store),
    restore: mapChangeList(Partnership.fromJson, Partnership.fromJson),
  },
  team: {
    accessor: returnId,
    toServer: mapChangeList<TeamMember, TeamMemberForSaveAPI, string>(TeamMember.forSaveAPI, returnId),
    store: mapChangeList(TeamMember.store, TeamMember.store),
    restore: mapChangeList(TeamMember.fromJson, TeamMember.fromJson),
  },
  budgets: {
    accessor: Budget.identify,
    toServer: Budget.forSaveAPI,
  },
};

@Injectable()
export class ProjectViewStateService extends AbstractViewState<Project> {

  constructor(
    storage: SessionStorageService,
    private projectService: ProjectService,
  ) {
    super(config, Project.fromJson({}), storage);
  }

  get project(): Observable<Project> {
    return this.subject;
  }

  get projectWithChanges(): Observable<Project> {
    return this.subjectWithChanges;
  }

  onNewId(id: string): void {
    this.projectService.getProject(id)
      .subscribe(this.onLoad);
  }

  async saveExtension(extension: ProjectExtension): Promise<void> {
    const project = await this.project.pipe(first()).toPromise();

    const result = await this.projectService.saveExtension(project.id, extension);
    const next = clone(project);
    next.extensions = [...next.extensions];

    const index = project.extensions.findIndex(e => e.id === result.id);
    if (index !== -1) {
      next.extensions[index] = result;
    } else {
      next.extensions.push(result);
    }

    this.onLoad.next(next);
  }

  updateEngagement(engagement: Engagement): void {
    this.project
      .pipe(
        first(),
        map(project => {
          const next = clone(project);
          next.engagements = [...next.engagements];

          const index = project.engagements.findIndex(e => e.id === engagement.id);
          if (index === -1) {
            throw new Error('Could not find engagement in project');
          }
          next.engagements[index] = engagement;

          return next;
        }),
      )
      .subscribe(this.onLoad);
  }

  protected onSave(project: Project, changes: ModifiedProject): Promise<SaveResult<Project>> {
    return this.projectService.save(project.id, changes);
  }

  protected refresh(project: Project): void {
    this.onNewId(project.id);
  }

  protected identify(project: Project): string {
    return `project-${project.id}`;
  }
}
