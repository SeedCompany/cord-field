import { Injectable } from '@angular/core';
import { PloApiService } from './http/plo-api.service';
import { Project } from '../models/project';

@Injectable()
export class ProjectService {

  constructor(private ploApiSerivce: PloApiService) {

  }

  getProjects() {
    return this
      .ploApiSerivce
      .request('GET', '/projects').forEach(json => Project.fromJson(json));
  }
}

