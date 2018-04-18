import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Project } from '../core/models/project';
import { ProjectService } from '../core/services/project.service';

@Injectable()
export class ProjectViewStateService {

  private _project = new BehaviorSubject<Project>(Project.fromJson({}));

  constructor(private projectService: ProjectService) {}

  get project(): Observable<Project> {
    return this._project.asObservable();
  }

  onNewId(id: string) {
    this.projectService.getProject(id).subscribe(project => this._project.next(project));
  }
}
