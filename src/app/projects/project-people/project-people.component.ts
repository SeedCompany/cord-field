import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectTabComponent } from '../abstract-project-tab';

@Component({
  selector: 'app-project-people',
  templateUrl: './project-people.component.html',
  styleUrls: ['./project-people.component.scss']
})
export class ProjectPeopleComponent extends ProjectTabComponent {

  constructor(route: ActivatedRoute) {
    super(route);
  }
}
