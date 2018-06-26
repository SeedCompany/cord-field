import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
  accessDates,
  ChangeConfig,
  ChangeEngine,
  Changes,
  mapChangeList,
  Modified,
  returnId
} from '../core/change-engine';
import { Language } from '../core/models/language';
import { Partnership, PartnershipForSaveAPI } from '../core/models/partnership';
import { Project } from '../core/models/project';
import { TeamMember, TeamMemberForSaveAPI } from '../core/models/team-member';
import { ProjectService } from '../core/services/project.service';

export type ModifiedProject = Modified<Project>;

@Injectable()
export class ProjectViewStateService {

  private _project = new BehaviorSubject<Project>(Project.fromJson({}));

  private submitting = new BehaviorSubject<boolean>(false);
  private _loadError = new Subject<Error>();

  private config: ChangeConfig = {
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
  private changeEngine: ChangeEngine;

  constructor(private projectService: ProjectService) {
    this.changeEngine = new ChangeEngine(this.config);
  }

  get project(): Observable<Project> {
    return this._project.asObservable();
  }

  get isDirty(): Observable<boolean> {
    return this.changeEngine.isDirty;
  }

  get isSubmitting(): Observable<boolean> {
    return this.submitting.asObservable();
  }

  get loadError(): Observable<Error> {
    return this._loadError.asObservable();
  }

  onNewId(id: string): void {
    this.projectService.getProject(id)
      .subscribe(
        this.onNewProject.bind(this),
        (err: Error) => this._loadError.next(err)
      );
  }

  change(changes: Changes<Project>): void {
    this.changeEngine.change(changes, this._project.value);
  }

  async save(): Promise<void> {
    this.submitting.next(true);
    try {
      await this.projectService.save(this._project.value.id, this.changeEngine.getModifiedForServer());
    } finally {
      this.submitting.next(false);
    }

    const project = this.changeEngine.getModified(this._project.value);
    const needsRefresh = this.changeEngine.needsRefresh;

    this.onNewProject(project);

    if (needsRefresh) {
      this.onNewId(project.id);
    }
  }

  discard(): void {
    this.onNewProject(this._project.value);
  }

  private onNewProject(project: Project): void {
    this.changeEngine.reset();
    this._project.next(project);
  }
}
