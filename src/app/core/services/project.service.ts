import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { PloApiService } from './http/plo-api.service';

@Injectable()
export class ProjectService {

  constructor(private ploApiSerivce: PloApiService) {

  }

  getProjects(): Observable<Project[]> {
    return this
      .ploApiSerivce
      .get('/projects')
      .map((projects: any) => projects.map(project => Project.fromJson(project)));
  }
}

