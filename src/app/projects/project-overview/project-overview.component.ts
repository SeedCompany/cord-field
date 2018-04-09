import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectTabComponent } from '../abstract-project-tab';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent extends ProjectTabComponent {

  constructor(route: ActivatedRoute) {
    super(route);
  }
}
