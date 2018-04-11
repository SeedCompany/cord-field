import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ProjectCreationResult } from '../../projects/project-create-dialog/project-create-dialog.component';
import { Project, ProjectsWithCount } from '../models/project';
import { PloApiService } from './http/plo-api.service';

@Injectable()
export class ProjectService {

  constructor(private ploApi: PloApiService) {
  }

  getProject(id: string): Observable<Project> {
    return this.ploApi
      .get(`/projects/${id}`)
      .map(Project.fromJson);
  }

  getProjects(sort: keyof Project = 'updatedAt', order: SortDirection = 'desc', skip = 0, limit = 10): Observable<ProjectsWithCount> {
    const url = `/projects?sort=${sort}&skip=${skip}&limit=${limit}&order=${order}`;

    return this
      .ploApi
      .get(url, {observe: 'response'})
      .map((response: HttpResponse<Project[]>) => {
        return {
          projects: Project.fromJsonArray(response.body),
          count: Number(response.headers.get('x-sc-total-count')) || 0
        };
      });
  }

  isProjectNameAvailable(name: string): Promise<boolean> {
    return this
      .ploApi
      .get(`/projects/exists?name=${name}`)
      .toPromise()
      .then(data => false)
      .catch(err => err.status === 409);
  }

  async createProject(project: ProjectCreationResult): Promise<string> {
      const proObj = await this.ploApi.post('/projects', project).toPromise();
      return proObj['id'];
  }
}
