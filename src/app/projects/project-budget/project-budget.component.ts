import { Component } from '@angular/core';
import { ProjectTabComponent } from '../abstract-project-tab';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-budget',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.scss']
})
export class ProjectBudgetComponent extends ProjectTabComponent {

  constructor(projectViewState: ProjectViewStateService) {
    super(projectViewState);
  }
}
