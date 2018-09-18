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

  readonly ProjectSensitivity = ProjectSensitivity;

  @Input() project: Project | null;

  readonly links: LinkConfig[] = [
    {path: '', label: 'Engagement Details'},
    {path: '/forms', label: 'Project Forms'}
  ];

  trackLinkBy(index: number, link: LinkConfig) {
    return link.label;
  }
}
