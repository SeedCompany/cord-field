import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import { Engagement, EngagementStatus } from '@app/core/models/engagement';
import { EnumList } from '@app/core/models/enum';

import { AuthenticationService } from '@app/core/services/authentication.service';
import { StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModifiedProject } from '../../projects/project-view-state.service';
import { SaveResult } from '../abstract-view-state';
import { ProjectCreationResult } from '../create-dialogs/project-create-dialog/project-create-dialog.component';
import {
  ExtensionStatus,
  Project,
  ProjectExtension,
  ProjectFilter,
  ProjectSensitivity,
  ProjectStatus,
  ProjectsWithCount,
  ProjectType,
} from '../models/project';
import { HttpParams } from './http/abstract-http-client';
import { PloApiService } from './http/plo-api.service';

export interface ProjectFilterAPI {
  type?: ProjectType;
  status?: ProjectStatus[];
  languages?: string[];
  locationId?: string[];
  team?: string[];
  sensitivity?: ProjectSensitivity[];
  createdAt?: {gte?: DateTime, lte?: DateTime};
  updatedAt?: {gte?: DateTime, lte?: DateTime};
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  constructor(private authService: AuthenticationService,
              private ploApi: PloApiService) {
  }

  getProject(id: string): Observable<Project> {
    return this.ploApi
      .get(`/projects/${id}`)
      .pipe(map(Project.fromJson));
  }

  async getProjects(sort: keyof Project = 'updatedAt',
                    order: SortDirection = 'desc',
                    skip = 0,
                    limit = 10,
                    filter?: ProjectFilter,
                    fields?: Array<keyof Project>,
                    isMine?: boolean): Promise<ProjectsWithCount> {

    const params: HttpParams = {
      sort,
      skip: skip.toString(),
      limit: limit.toString(),
      order,
    };

    if (isMine) {
      const user = await this.authService.getCurrentUser();
      params.onlyMine = user!.id;
    }
    if (filter) {
      const filterAPI = this.buildFilter(filter);
      params.filter = JSON.stringify(filterAPI);
    }
    if (fields) {
      params.fields = fields;
    }

    return this
      .ploApi
      .get<Project[]>('/projects', {params, observe: 'response'})
      .pipe(map((response: HttpResponse<Project[]>) => {
        return {
          projects: Project.fromJsonArray(response.body),
          count: Number(response.headers.get('x-sc-total-count')) || 0,
        };
      })).toPromise();
  }

  isProjectNameTaken(name: string): Promise<boolean> {
    return this
      .ploApi
      .get(`/projects/exists?name=${name}`)
      .toPromise()
      .then(() => false)
      .catch(err => {
        if (err.status === 409) {
          return true;
        }

        throw err;
      });
  }

  async createProject(project: ProjectCreationResult): Promise<string> {
    const obj = await this.ploApi.post<{id: string}>('/projects', project).toPromise();
    return obj.id;
  }

  save(id: string, modified: ModifiedProject): Promise<SaveResult<Project>> {
    return this.ploApi.put<SaveResult<Project>>(`/projects/${id}/save`, modified).toPromise();
  }

  private buildFilter(filter: ProjectFilter): ProjectFilterAPI {
    const {dateRange, startDate, endDate, ...rest} = filter;

    const languages = rest.languages ? rest.languages.map(l => l.id) : undefined;
    const locationId = rest.location ? rest.location.map(l => l.id) : undefined;
    const team = rest.team ? rest.team.map(member => member.id) : undefined;

    const date = dateRange && (startDate || endDate)
      ? {
        [dateRange]: {
          gte: startDate,
          lte: endDate,
        },
      }
      : undefined;

    return {...rest, languages, locationId, team, ...date} as ProjectFilterAPI;
  }

  getAvailableStatuses(project: Project): StatusOptions<ProjectStatus> {
    const transitions = this.getAvailableStatusesInner(project.status)
      .filter(([text, status]) => !status || project.possibleStatuses.includes(status))
      .map(([ui, value]) => ({ ui, value }));
    const bypassWorkflow = project.possibleStatuses.length === ProjectStatus.length;
    const overrides = bypassWorkflow
      ? (ProjectStatus.entries() as EnumList<ProjectStatus>)
        .filter(entry => entry.value !== project.status)
      : [];
    return { transitions, overrides };
  }

  private getAvailableStatusesInner(status: ProjectStatus): Array<[string, ProjectStatus]> {
    switch (status) {
      case ProjectStatus.EarlyConversations: // FC
        return [
          ['Submit for Concept Approval', ProjectStatus.PendingConceptApproval],
          [`Won't do`, ProjectStatus.DidNotDevelop],
        ];
      case ProjectStatus.PendingConceptApproval: // AD
        return [
          ['Approve Concept', ProjectStatus.PrepForConsultantEndorsement],
          ['Send Back for Corrections', ProjectStatus.EarlyConversations],
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
          ['End Development', ProjectStatus.DidNotDevelop],
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
          ['Approve for Regional Director Approval', ProjectStatus.PendingRegionalDirectorApproval],
          ['Send Back for Corrections', ProjectStatus.FinalizingProposal],
          ['Reject', ProjectStatus.Rejected],
        ];
      case ProjectStatus.PendingRegionalDirectorApproval: // RD
        return [
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

  getAvailableEngagementStatuses(engagement: Engagement): StatusOptions<EngagementStatus> {
    const transitions = this.getAvailableEngagementStatusesInner(engagement.status)
      .filter(([text, status]) => !status || engagement.possibleStatuses.includes(status))
      .map(([ui, value]) => ({ ui, value }));
    const bypassWorkflow = engagement.possibleStatuses.length === EngagementStatus.length;
    const overrides = bypassWorkflow
      ? (EngagementStatus.entries() as EnumList<EngagementStatus>)
        .filter(entry => entry.value !== engagement.status)
      : [];
    return { transitions, overrides };
  }

  private getAvailableEngagementStatusesInner(status: EngagementStatus): Array<[string, EngagementStatus]> {
    switch (status) {
      case EngagementStatus.Active:
        return [
          ['Suspend', EngagementStatus.Suspended],
          ['Terminate', EngagementStatus.Terminated],
          ['Complete', EngagementStatus.Completed],
          ['Convert', EngagementStatus.Converted],
        ];
      case EngagementStatus.InDevelopment:
        return [
          ['Approve', EngagementStatus.Active],
        ];
      case EngagementStatus.Suspended:
        return [
          ['Reactivate', EngagementStatus.Active],
          ['Terminate', EngagementStatus.Terminated],
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
        .put<{extensions: ProjectExtension[]}>(`/projects/${projectId}/extensions/${extension.id}`, extension)
        .pipe(map(res => res.extensions.find(ext => ext.id === extension.id)!))
        .toPromise();
    }
  }
}
