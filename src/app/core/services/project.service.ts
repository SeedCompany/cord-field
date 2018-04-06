import { Injectable } from '@angular/core';
import { PloApiService } from './http/plo-api.service';
import { Project } from '../models/project';
import 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ProjectService {

  constructor(private ploApiSerivce: PloApiService) {

  }

  getProjects(): Observable<Project[]> {
    return this
      .ploApiSerivce
      .get('/projects')
      .map((projects: any) => Project.fromJsonArray(projects));
  }
}

