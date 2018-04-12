import { Component, Input } from '@angular/core';
import { Project } from '../../core/models/project';

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

  @Input() project: Project;

  readonly links: LinkConfig[] = [
    {path: '', label: 'Engagement Details'},
    {path: '/forms', label: 'Project Forms'}
  ];

  // These should be replaced with values from Project model once it has them
  pictureUrl = '//via.placeholder.com/300x150/2b2b2b';
  displayLocation = 'Display Location';
  sensitivityLevel = 'Level 1';
  stageName = 'Concept Development';
  nextStage = 'Concept Approval';
  stageProgress = 10;

  trackLinkBy(index: number, link: LinkConfig) {
    return link.label;
  }
}
