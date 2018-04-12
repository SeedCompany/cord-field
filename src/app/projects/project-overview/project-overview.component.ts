import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../core/models/project';
import { ProjectService } from '../../core/services/project.service';
import { ProjectTabComponent } from '../abstract-project-tab';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent extends ProjectTabComponent {

  project: Project = new Project();

  constructor(route: ActivatedRoute, private projectService: ProjectService) {
    super(route);
  }

  public onId(id: string): void {
    this.projectService.getProject(id).subscribe(project => this.project = project);
  }
}
