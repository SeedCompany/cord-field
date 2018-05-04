import { OnInit } from '@angular/core';
import { Project } from '../core/models/project';
import { ProjectViewStateService } from './project-view-state.service';

export abstract class ProjectTabComponent implements OnInit {

  public project: Project;

  constructor(protected projectViewState: ProjectViewStateService) {
  }

  ngOnInit() {
    this.projectViewState.project.subscribe(project => this.project = project);
  }
}
