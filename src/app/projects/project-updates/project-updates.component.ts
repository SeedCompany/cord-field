import { Component } from '@angular/core';
import { ProjectTabComponent } from '../abstract-project-tab';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-updates',
  templateUrl: './project-updates.component.html',
  styleUrls: ['./project-updates.component.scss']
})
export class ProjectUpdatesComponent extends ProjectTabComponent {

  constructor(projectViewState: ProjectViewStateService) {
    super(projectViewState);
  }
}
