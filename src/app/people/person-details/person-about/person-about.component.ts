import { Component, Input, OnInit } from '@angular/core';
import { ProjectRole } from '../../../core/models/project-role';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-person-about',
  templateUrl: './person-about.component.html',
  styleUrls: ['./person-about.component.scss']
})
export class PersonAboutComponent implements OnInit {

  readonly ProjectRole = ProjectRole;
  @Input() user: User;

  constructor() {
  }

  ngOnInit() {
  }

}
