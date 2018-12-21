import { Component, Input } from '@angular/core';
import { Project, ProjectSensitivity } from '@app/core/models/project';

@Component({
  selector: 'app-project-overview-sidebar',
  templateUrl: './project-overview-sidebar.component.html',
  styleUrls: ['./project-overview-sidebar.component.scss'],
})
export class ProjectOverviewSidebarComponent {
  @Input() project: Project | null;

  readonly ProjectSensitivity = ProjectSensitivity;
}
