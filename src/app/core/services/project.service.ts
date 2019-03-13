import { Injectable } from '@angular/core';
import { ModifiedBudgets } from '@app/core/models/budget';
import { ModifiedLanguages } from '@app/core/models/language';
import { ModifiedPartnerships } from '@app/core/models/partnership';
import { Role } from '@app/core/models/role';
import { Sensitivity } from '@app/core/models/sensitivity';
import { ModifiedTeamMembers } from '@app/core/models/team-member';
import { UserService } from '@app/core/services/user.service';
import { buildDateFilter, DateFilterAPI, toIds } from '@app/core/util/list-filters';
import { ApiOptions as ListApiOptions, listOptionsToHttpParams, makeListRequest } from '@app/core/util/list-views';
import { StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { DateTime } from 'luxon';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';
import { SaveResult } from '../abstract-view-state';
import { ProjectCreationResult } from '../create-dialogs/project-create-dialog/project-create-dialog.component';
import { ExtensionStatus, Project, ProjectExtension, ProjectFilter, ProjectStatus } from '../models/project';
import { PloApiService } from './http/plo-api.service';

export interface ProjectFilterAPI extends DateFilterAPI {
  status?: ProjectStatus[];
  languages?: string[];
  locationId?: string[];
  team?: string[];
  sensitivity?: Sensitivity[];
}

export interface ModifiedProject {
  mouStart?: DateTime;
  mouEnd?: DateTime;
  estimatedSubmission?: DateTime;
  status?: ProjectStatus;
  locationId?: string;
  languages?: ModifiedLanguages;
  partnerships?: ModifiedPartnerships;
  team?: ModifiedTeamMembers;
  budgets?: ModifiedBudgets;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  constructor(private ploApi: PloApiService,
              private userService: UserService) {
  }

  getProject(id: string): Observable<Project> {
    return this.ploApi
      .get(`/projects/${id}`)
      .pipe(map(Project.fromJson));
  }

  getProjects = ({ all, ...opts }: ListApiOptions<keyof Project, ProjectFilter> & { all: boolean }) =>
    makeListRequest(this.ploApi, '/projects', Project.fromJson)({
      ...listOptionsToHttpParams(this.buildFilter)(opts),
      ...(all ? {} : { onlyMine: 'true' }),
    });

  isProjectNameTaken(name: string): Observable<boolean> {
    return this
      .ploApi
      .get(`/projects/exists`, { params: { name } })
      .pipe(
        mapTo(false),
        catchError(err => {
          if (err.status === 409) {
            return of(true);
          }

          throw err;
        }),
      );
  }

  async createProject(project: ProjectCreationResult): Promise<string> {
    const obj = await this.ploApi.post<{ id: string }>('/projects', { ...project, type: 'translation' }).toPromise();
    return obj.id;
  }

  save(id: string, modified: ModifiedProject): Promise<SaveResult<Project>> {
    return this.ploApi.put<SaveResult<Project>>(`/projects/${id}/save`, modified).toPromise();
  }

  private buildFilter = ({ languages, location, team, ...filters }: ProjectFilter): ProjectFilterAPI => ({
    languages: toIds(languages),
    locationId: toIds(location),
    team: toIds(team),
    ...buildDateFilter(filters),
  });

  getAvailableStatuses(project: Project): StatusOptions<ProjectStatus> {
    const transitions = this.getAvailableStatusesInner(project.status)
      .filter(([text, status]) => !status || project.possibleStatuses.includes(status))
      .map(([ui, value]) => ({ ui, value }));
    const bypassWorkflow = project.possibleStatuses.length === ProjectStatus.length;

    const overrides = (this.userService.hasRole(Role.Admin))
      ? ProjectStatus.entries()
      : bypassWorkflow
        ? ProjectStatus.entries()
          .filter(entry => entry.value !== project.status)
        : [];

    return { transitions, overrides };
  }

  private getAvailableStatusesInner(status: ProjectStatus): Array<[string, ProjectStatus]> {
    switch (status) {
      case ProjectStatus.EarlyConversations: // FC
        return [
          ['Submit for Concept Approval', ProjectStatus.PendingConceptApproval],
          [`End Development`, ProjectStatus.DidNotDevelop],
        ];
      case ProjectStatus.PendingConceptApproval: // AD
        return [
          ['Approve Concept', ProjectStatus.PrepForConsultantEndorsement],
          ['Send Back for Corrections to Concept Approval', ProjectStatus.EarlyConversations],
          ['Reject', ProjectStatus.Rejected],
        ];
      case ProjectStatus.PrepForConsultantEndorsement: // FC
        return [
          ['Submit for Consultant Endorsement', ProjectStatus.PendingConsultantEndorsement],
          ['End Development', ProjectStatus.DidNotDevelop],
        ];
      case ProjectStatus.PendingConsultantEndorsement: // Consultant
        return [
          ['Endorse Plan', ProjectStatus.PrepForFinancialEndorsement],
          ['Do Not Endorse Plan', ProjectStatus.PrepForFinancialEndorsement],
        ];
      case ProjectStatus.PrepForFinancialEndorsement: // FC
        return [
          ['Submit for Financial Endorsement', ProjectStatus.PendingFinancialEndorsement],
          ['End Development', ProjectStatus.DidNotDevelop],
        ];
      case ProjectStatus.PendingFinancialEndorsement: // FA
        return [
          ['Strongly Endorse', ProjectStatus.FinalizingProposal],
          ['Endorse with Hesitation', ProjectStatus.FinalizingProposal],
        ];
      case ProjectStatus.FinalizingProposal: // FC
        return [
          ['Submit for Area Director Approval', ProjectStatus.PendingAreaDirectorApproval],
          ['End Development', ProjectStatus.DidNotDevelop],
        ];
      case ProjectStatus.PendingAreaDirectorApproval: // AD
        return [
          ['Approve for Finance Confirmation', ProjectStatus.PendingFinanceConfirmation],
          ['Approve for Regional Director Approval', ProjectStatus.PendingRegionalDirectorApproval],
          ['Send Back for Corrections', ProjectStatus.FinalizingProposal],
          ['Send Back for Corrections to Concept Approval', ProjectStatus.EarlyConversations],
          ['Send Back for Corrections to Consultant Endorsement', ProjectStatus.PendingConsultantEndorsement],
          ['Send Back for Corrections to Financial Endorsement', ProjectStatus.PendingFinancialEndorsement],
          ['Reject', ProjectStatus.Rejected],
        ];
      case ProjectStatus.PendingRegionalDirectorApproval: // RD
        return [
          ['Send Back for Corrections to Concept Approval', ProjectStatus.EarlyConversations],
          ['Send Back for Corrections to Consultant Endorsement', ProjectStatus.PendingConsultantEndorsement],
          ['Send Back for Corrections to Financial Endorsement', ProjectStatus.PendingFinancialEndorsement],
          ['Send Back for Corrections to Area Director Approval', ProjectStatus.PendingAreaDirectorApproval],
          ['Approve for Finance Confirmation', ProjectStatus.PendingFinanceConfirmation],
          ['Send Back for Corrections', ProjectStatus.EarlyConversations],
          ['Reject', ProjectStatus.Rejected],
        ];
      case ProjectStatus.PendingFinanceConfirmation: // Controller
        return [
          ['Confirm Project', ProjectStatus.Active],
          ['Hold Project', ProjectStatus.OnHoldFinanceConfirmation],
          ['Reject', ProjectStatus.Rejected],
        ];
      case ProjectStatus.OnHoldFinanceConfirmation: // FA
        return [
          ['Confirm Project', ProjectStatus.Active],
          ['Reject', ProjectStatus.Rejected],
        ];
      case ProjectStatus.Active:
        return [
          ['Suspend Project', ProjectStatus.Suspended],
          ['Terminate Project', ProjectStatus.Terminated],
          ['Complete Project', ProjectStatus.Completed],
        ];
      case ProjectStatus.Suspended:
        return [
          ['Reactivate Project', ProjectStatus.Active],
          ['Terminate Project', ProjectStatus.Terminated],
        ];
      default:
        return [];
    }
  }

  async saveExtension(projectId: string, extension: ProjectExtension) {
    if (extension.id === 'new') {
      return this.ploApi
        .post<ProjectExtension>(`/projects/${projectId}/extensions`, {
          ...extension,
          status: ExtensionStatus.Draft,
        })
        .pipe(map(ProjectExtension.fromJson))
        .toPromise();
    } else {
      return this.ploApi
        .put<{ extensions: ProjectExtension[] }>(`/projects/${projectId}/extensions/${extension.id}`, extension)
        .pipe(map(res => res.extensions.find(ext => ext.id === extension.id)!))
        .toPromise();
    }
  }
}
