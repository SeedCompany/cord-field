import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectTabComponent } from '../abstract-project-tab';

@Component({
  selector: 'app-project-updates',
  templateUrl: './project-updates.component.html',
  styleUrls: ['./project-updates.component.scss']
})
export class ProjectUpdatesComponent extends ProjectTabComponent {

  constructor(route: ActivatedRoute) {
    super(route);
  }
}
