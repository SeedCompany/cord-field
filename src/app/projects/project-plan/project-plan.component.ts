import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectTabComponent } from '../abstract-project-tab';

@Component({
  selector: 'app-project-plan',
  templateUrl: './project-plan.component.html',
  styleUrls: ['./project-plan.component.scss']
})
export class ProjectPlanComponent extends ProjectTabComponent {

  constructor(route: ActivatedRoute) {
    super(route);
  }
}
