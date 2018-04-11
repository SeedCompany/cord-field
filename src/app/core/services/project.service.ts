import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Project, ProjectsWithCount } from '../models/project';
import { PloApiService } from './http/plo-api.service';

const SORT = 'updatedAt';
const SKIP = 0;
const LIMIT = 10;
const ORDER = 'desc';

@Injectable()
export class ProjectService {

  constructor(private ploApiSerivce: PloApiService) {

  }

  getProjects(sort = SORT, order = ORDER, skip = SKIP, limit = LIMIT): Observable<ProjectsWithCount> {

    const projectUrl = `/projects?sort=${sort}&skip=${skip}&limit=${limit}&order=${order}`;

    return this
      .ploApiSerivce
      .get(projectUrl, {observe: 'response'})
      .map(response => {
        return {
          projects: Project.fromJsonArray(response.body),
          count: Number(response.headers.get('x-sc-total-count')) || 0
        };
      });
  }
}

