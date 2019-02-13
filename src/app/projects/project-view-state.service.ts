import { Injectable } from '@angular/core';
import { Budget } from '@app/core/models/budget';
import { ProjectEngagement as Engagement } from '@app/core/models/project';
import { SessionStorageService } from '@app/core/services/storage.service';
import { clone } from '@app/core/util';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AbstractViewState, SaveResult } from '../core/abstract-view-state';
import { ChangeConfig, dateConfig } from '../core/change-engine';
import { Language } from '../core/models/language';
import { Location } from '../core/models/location';
import { Partnership } from '../core/models/partnership';
import { Project, ProjectExtension } from '../core/models/project';
import { TeamMember } from '../core/models/team-member';
import { ModifiedProject, ProjectService } from '../core/services/project.service';

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
    ...Location.fieldConfig(),
    forceRefresh: true,
  },
  languages: {
    ...Language.fieldConfigList(),
    forceRefresh: true, // Languages changes engagements
  },
  partnerships: {
    ...Partnership.fieldConfigList(),
    forceRefresh: true,
  },
  team: TeamMember.fieldConfigList(),
  budgets: Budget.fieldConfigList(),
};

@Injectable()
export class ProjectViewStateService extends AbstractViewState<Project, ModifiedProject> {

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
