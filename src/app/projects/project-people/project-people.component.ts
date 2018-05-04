import { Component } from '@angular/core';
import { ProjectTabComponent } from '../abstract-project-tab';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-people',
  templateUrl: './project-people.component.html',
  styleUrls: ['./project-people.component.scss']
})
export class ProjectPeopleComponent extends ProjectTabComponent {

  constructor(projectViewState: ProjectViewStateService) {
    super(projectViewState);
  }
}
