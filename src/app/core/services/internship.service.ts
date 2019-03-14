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
import { ProjectService } from '@app/core/services/project.service';
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
    private projects: ProjectService,
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
    return this.projects.getAvailableStatuses(internship);
  }

  saveEngagement(id: string, data: Partial<EditableInternshipEngagement>) {
    return this.api.put(`/internships/engagements/${id}/save`, data).toPromise();
  }

  getEngagementAvailableStatuses(engagement: InternshipEngagement): StatusOptions<InternshipEngagementStatus> {
    return this.projectEngagements.getAvailableStatuses(engagement);
  }
}
