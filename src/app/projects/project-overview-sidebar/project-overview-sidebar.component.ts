import { Component, Input } from '@angular/core';
import { Project } from '@app/core/models/project';
import { Sensitivity } from '@app/core/models/sensitivity';

@Component({
  selector: 'app-project-overview-sidebar',
  templateUrl: './project-overview-sidebar.component.html',
  styleUrls: ['./project-overview-sidebar.component.scss'],
})
export class ProjectOverviewSidebarComponent {
  @Input() project: Project | null;

  readonly Sensitivity = Sensitivity;
}
