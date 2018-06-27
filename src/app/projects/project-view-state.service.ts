import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs/Observable';
import { AbstractViewState } from '../core/abstract-view-state';
import { accessDates, ChangeConfig, mapChangeList, returnId } from '../core/change-engine';
import { Language } from '../core/models/language';
import { Partnership, PartnershipForSaveAPI } from '../core/models/partnership';
import { Project } from '../core/models/project';
import { TeamMember, TeamMemberForSaveAPI } from '../core/models/team-member';
import { ProjectService } from '../core/services/project.service';

export interface ModifiedProject {
  mouStart?: DateTime;
  mouEnd?: DateTime;
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
}

const config: ChangeConfig<Project> = {
  mouStart: {
    accessor: accessDates
  },
  mouEnd: {
    accessor: accessDates
  },
  location: {
    accessor: returnId,
    toServer: returnId,
    key: 'locationId',
    forceRefresh: true
  },
  languages: {
    accessor: returnId,
    toServer: mapChangeList<Language, string, string>(returnId, returnId)
  },
  partnerships: {
    accessor: returnId,
    toServer: mapChangeList<Partnership, PartnershipForSaveAPI, string>(Partnership.forSaveAPI, returnId)
  },
  team: {
    accessor: returnId,
    toServer: mapChangeList<TeamMember, TeamMemberForSaveAPI, string>(TeamMember.forSaveAPI, returnId)
  }
};

@Injectable()
export class ProjectViewStateService extends AbstractViewState<Project> {

  constructor(private projectService: ProjectService) {
    super(config, Project.fromJson({}));
  }

  get project(): Observable<Project> {
    return this.subject;
  }

  onNewId(id: string): void {
    this.projectService.getProject(id)
      .subscribe(this.onLoad);
  }

  protected async onSave(project: Project, changes: ModifiedProject): Promise<void> {
    await this.projectService.save(project.id, changes);
  }

  protected refresh(project: Project): void {
    this.onNewId(project.id);
  }
}
