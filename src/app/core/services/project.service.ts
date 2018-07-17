import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs/Observable';
import { ModifiedProject } from '../../projects/project-view-state.service';
import { SaveResult } from '../abstract-view-state';
import { ProjectCreationResult } from '../create-dialogs/project-create-dialog/project-create-dialog.component';
import {
  Project,
  ProjectFilter,
  ProjectSensitivity,
  ProjectStage,
  ProjectStatus,
  ProjectsWithCount,
  ProjectType
} from '../models/project';
import { HttpParams } from './http/abstract-http-client';
import { PloApiService } from './http/plo-api.service';

export interface ProjectFilterAPI {
  type?: ProjectType;
  status?: ProjectStatus[];
  stage?: ProjectStage[];
  languages?: string[];
  locationId?: string[];
  team?: string[];
  sensitivity?: ProjectSensitivity[];
  createdAt?: {gte?: DateTime, lte?: DateTime};
  updatedAt?: {gte?: DateTime, lte?: DateTime};
}

@Injectable()
export class ProjectService {

  constructor(private ploApi: PloApiService) {
  }

  getProject(id: string): Observable<Project> {
    return this.ploApi
      .get(`/projects/${id}`)
      .map(Project.fromJson);
  }

  getProjects(sort: keyof Project = 'updatedAt',
              order: SortDirection = 'desc',
              skip = 0,
              limit = 10,
              filter?: ProjectFilter,
              fields?: Array<keyof Project>,
              isMine?: boolean): Observable<ProjectsWithCount> {

    const params: HttpParams = {
      sort,
      skip: skip.toString(),
      limit: limit.toString(),
      order
    };

    if (isMine) {
      params.userId = 'me';
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
      .map((response: HttpResponse<Project[]>) => {
        return {
          projects: Project.fromJsonArray(response.body),
          count: Number(response.headers.get('x-sc-total-count')) || 0
        };
      });
  }

  private buildFilter(filter: ProjectFilter): ProjectFilterAPI {
    const {dateRange, startDate, endDate, ...rest} = filter;

    const languages = rest.languages ? rest.languages.map(l => l.id) : undefined;
    const locationId = rest.location ? rest.location.map(l => l.id) : undefined;
    const team = rest.team ? rest.team.map(member => member.id) : undefined;

    const date = dateRange && (startDate || endDate)
      ? {[dateRange]: {
          gte: startDate,
          lte: endDate
        }}
      : undefined;

    return {...rest, languages, locationId, team, ...date} as ProjectFilterAPI;
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
}
