import { Component, Input } from '@angular/core';
import { Project, ProjectSensitivity } from '@app/core/models/project';

interface LinkConfig {
  path: string;
  label: string;
}

@Component({
  selector: 'app-project-overview-sidebar',
  templateUrl: './project-overview-sidebar.component.html',
  styleUrls: ['./project-overview-sidebar.component.scss']
})
export class ProjectOverviewSidebarComponent {
  @Input() project: Project | null;

  readonly ProjectSensitivity = ProjectSensitivity;

  trackLinkBy(index: number, link: LinkConfig) {
    return link.label;
  }
}
