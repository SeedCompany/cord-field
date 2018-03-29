import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-people',
  templateUrl: './project-people.component.html',
  styleUrls: ['./project-people.component.scss']
})
export class ProjectPeopleComponent implements OnInit {

  @Input() id: string;

  constructor() {
  }

  ngOnInit() {
  }
}
