import { Injectable } from '@angular/core';
import { ProjectBudget } from '@app/core/models/budget';
import { Engagement } from '@app/core/models/engagement';
import { clone } from '@app/core/util';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AbstractViewState, SaveResult } from '../core/abstract-view-state';
import { accessDates, ChangeConfig, mapChangeList, returnId } from '../core/change-engine';
import { Language } from '../core/models/language';
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
  budgets?: ProjectBudget[];
}

const config: ChangeConfig<Project> = {
  mouStart: {
    accessor: accessDates,
    forceRefresh: true
  },
  mouEnd: {
    accessor: accessDates,
    forceRefresh: true
  },
  estimatedSubmission: {
    accessor: accessDates
  },
  status: {},
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
    toServer: mapChangeList<Partnership, PartnershipForSaveAPI, string>(Partnership.forSaveAPI, returnId),
    forceRefresh: true
  },
  team: {
    accessor: returnId,
    toServer: mapChangeList<TeamMember, TeamMemberForSaveAPI, string>(TeamMember.forSaveAPI, returnId)
  },
  budgets: {
    // Identify project budget as a scalar value
    accessor: (budget: ProjectBudget) => ([
      budget.id,
      budget.status,
      budget.budgetDetails.map(item => Number(item.amount || 0)).join(',')
    ].join(',')),
    // Map organization back to organizationId
    toServer: (budgets: ProjectBudget[]) => budgets.map(budget => ({
      id: budget.id,
      status: budget.status,
      budgetDetails: budget.budgetDetails.map(detail => ({
        organizationId: detail.organization.id,
        fiscalYear: detail.fiscalYear,
        amount: detail.amount
      }))
    }))
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
        })
      )
      .subscribe(this.onLoad);
  }

  protected onSave(project: Project, changes: ModifiedProject): Promise<SaveResult<Project>> {
    return this.projectService.save(project.id, changes);
  }

  protected refresh(project: Project): void {
    this.onNewId(project.id);
  }
}
