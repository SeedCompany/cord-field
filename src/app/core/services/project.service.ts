import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { PloApiService } from './http/plo-api.service';

const SORT = 'updatedAt';
const SKIP = 0;
const LIMIT = 10;

@Injectable()
export class ProjectService {

  constructor(private ploApiSerivce: PloApiService) {

  }

  getProjects(sort = SORT, skip = SKIP, limit = LIMIT): Observable<Project[]> {

    const projectUrl = `/projects?sort=${sort}&skip=${skip}&limit=${limit}`;

    return this
      .ploApiSerivce
      .get(projectUrl)
      .map((projects: any) => Project.fromJsonArray(projects));
  }
}

