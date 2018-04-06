import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectTabComponent } from '../abstract-project-tab';

@Component({
  selector: 'app-project-budget',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.scss']
})
export class ProjectBudgetComponent extends ProjectTabComponent {

  constructor(route: ActivatedRoute) {
    super(route);
  }
}
