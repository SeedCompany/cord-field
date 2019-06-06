import { Injectable } from '@angular/core';
import { ModifiedBudgets } from '@app/core/models/budget';
import {
  EditableInternshipEngagement,
  Internship,
  InternshipEngagement,
  InternshipEngagementStatus,
  InternshipFilter,
  InternshipListItem,
  InternshipStatus,
} from '@app/core/models/internship';
import { ModifiedPartnerships } from '@app/core/models/partnership';
import { Sensitivity } from '@app/core/models/sensitivity';
import { ModifiedTeamMembers } from '@app/core/models/team-member';
import { ProjectEngagementService } from '@app/core/services/project-engagement.service';
import { buildDateFilter, DateFilterAPI, toIds } from '@app/core/util/list-filters';
import { ApiOptions as ListApiOptions, listOptionsToHttpParams, makeListRequest } from '@app/core/util/list-views';
import { StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { DateTime } from 'luxon';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';
import { SaveResult } from '../abstract-view-state';
import { PloApiService } from './http/plo-api.service';

export interface InternshipListFilterAPI extends DateFilterAPI {
  status?: InternshipStatus[];
  locationId?: string[];
  team?: string[];
  sensitivity?: Sensitivity[];
}

export interface ModifiedInternship {
  mouStart?: DateTime;
  mouEnd?: DateTime;
  estimatedSubmission?: DateTime;
  status?: InternshipStatus;
  locationId?: string;
  partnerships?: ModifiedPartnerships;
  team?: ModifiedTeamMembers;
  budgets?: ModifiedBudgets;
}

@Injectable({
  providedIn: 'root',
})
export class InternshipService {

  constructor(
    private api: PloApiService,
    private projectEngagements: ProjectEngagementService,
  ) {
  }

  get(id: string): Observable<Internship> {
    return this.api
      .get(`/internships/${id}`)
      .pipe(map(Internship.fromJson));
  }

  list = ({ all, ...opts }: ListApiOptions<keyof InternshipListItem, InternshipFilter> & { all: boolean }) =>
    makeListRequest(this.api, '/internships', InternshipListItem.fromJson)({
      ...listOptionsToHttpParams(({ location, team, ...filters }: InternshipFilter): InternshipListFilterAPI => ({
        locationId: toIds(location),
        team: toIds(team),
        ...buildDateFilter(filters),
      }))(opts),
      ...(all ? {} : { onlyMine: 'true' }),
    });

  isNameTaken(name: string): Observable<boolean> {
    return this
      .api
      .get(`/internships/exists`, { params: { name } })
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

  async create(name: string): Promise<string> {
    const obj = await this.api.post<{ id: string }>('/internships', { name }).toPromise();
    return obj.id;
  }

  save(id: string, modified: ModifiedInternship): Promise<SaveResult<Internship>> {
    return this.api.put<SaveResult<Internship>>(`/internships/${id}/save`, modified).toPromise();
  }

  getAvailableStatuses(internship: Internship): StatusOptions<InternshipStatus> {
    const transitions = this.getAvailableStatusesInner(internship.status)
      .filter(([text, status]) => !status || internship.possibleStatuses.includes(status))
      .map(([ui, value]) => ({ ui, value }));
    const bypassWorkflow = internship.possibleStatuses.length === InternshipStatus.length;
    const overrides = bypassWorkflow
      ? InternshipStatus.entries()
        .filter(entry => entry.value !== internship.status)
      : [];
    return { transitions, overrides };
  }

  private getAvailableStatusesInner(status: InternshipStatus): Array<[string, InternshipStatus]> {
    switch (status) {
      case InternshipStatus.EarlyConversations: // FC
        return [
          ['Submit for Concept Approval', InternshipStatus.PendingConceptApproval],
          [`End Development`, InternshipStatus.DidNotDevelop],
        ];
      case InternshipStatus.PendingConceptApproval: // AD
        return [
          ['Approve Concept', InternshipStatus.PrepForGrowthPlanEndorsement],
          ['Send Back for Corrections to Concept Approval', InternshipStatus.EarlyConversations],
          ['Reject', InternshipStatus.Rejected],
        ];
      case InternshipStatus.PrepForGrowthPlanEndorsement: // FC
        return [
          ['Submit for Growth Plan Endorsement', InternshipStatus.PendingGrowthPlanEndorsement],
          ['End Development', InternshipStatus.DidNotDevelop],
        ];
      case InternshipStatus.PendingGrowthPlanEndorsement: // Mentor
        return [
          ['Endorse Plan', InternshipStatus.PrepForFinancialEndorsement],
          ['Do Not Endorse Plan', InternshipStatus.PrepForFinancialEndorsement],
        ];
      case InternshipStatus.PrepForFinancialEndorsement: // FC
        return [
          ['Submit for Financial Endorsement', InternshipStatus.PendingFinancialEndorsement],
          ['End Development', InternshipStatus.DidNotDevelop],
        ];
      case InternshipStatus.PendingFinancialEndorsement: // FA
        return [
          ['Strongly Endorse', InternshipStatus.FinalizingProposal],
          ['Endorse with Hesitation', InternshipStatus.FinalizingProposal],
        ];
      case InternshipStatus.FinalizingProposal: // FC
        return [
          ['Submit for Area Director Approval', InternshipStatus.PendingAreaDirectorApproval],
          ['End Development', InternshipStatus.Active],
          ['Hold Project', InternshipStatus.OnHoldFinanceConfirmation],
          ['Reject', InternshipStatus.Rejected],
        ];
      case InternshipStatus.OnHoldFinanceConfirmation: // FA
        return [
          ['Confirm Project', InternshipStatus.Active],
          ['Reject', InternshipStatus.Rejected],
        ];
      case InternshipStatus.Active:
        return [
          ['Suspend Project', InternshipStatus.Suspended],
          ['Terminate Project', InternshipStatus.Terminated],
          ['Complete Project', InternshipStatus.Completed],
        ];
      case InternshipStatus.Suspended:
        return [
          ['Reactivate Project', InternshipStatus.Active],
          ['Terminate Project', InternshipStatus.Terminated],
        ];
      default:
        return [];
    }
  }

  saveEngagement(id: string, data: Partial<EditableInternshipEngagement>) {
    return this.api.put(`/internships/engagements/${id}/save`, data).toPromise();
  }

  getEngagementAvailableStatuses(engagement: InternshipEngagement): StatusOptions<InternshipEngagementStatus> {
    return this.projectEngagements.getAvailableStatuses(engagement);
  }
}
