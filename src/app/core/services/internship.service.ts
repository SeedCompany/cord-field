import { Injectable } from '@angular/core';
import { Internship, InternshipFilter, InternshipStatus } from '@app/core/models/internship';
import { Sensitivity } from '@app/core/models/sensitivity';
import { ProjectService } from '@app/core/services/project.service';
import { buildDateFilter, DateFilterAPI, toIds } from '@app/core/util/list-filters';
import { ApiOptions as ListApiOptions, listOptionsToHttpParams, makeListRequest } from '@app/core/util/list-views';
import { StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
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

@Injectable({
  providedIn: 'root',
})
export class InternshipService {

  constructor(
    private api: PloApiService,
    private projects: ProjectService,
  ) {
  }

  get(id: string): Observable<Internship> {
    return this.api
      .get(`/internships/${id}`)
      .pipe(map(Internship.fromJson));
  }

  list = ({ all, ...opts }: ListApiOptions<keyof Internship, InternshipFilter> & { all: boolean }) =>
    makeListRequest(this.api, '/internships', Internship.fromJson)({
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

  save(id: string, modified: unknown): Promise<SaveResult<Internship>> {
    return this.api.put<SaveResult<Internship>>(`/internships/${id}/save`, modified).toPromise();
  }

  getAvailableStatuses(internship: Internship): StatusOptions<InternshipStatus> {
    return this.projects.getAvailableStatuses(internship);
  }
}
