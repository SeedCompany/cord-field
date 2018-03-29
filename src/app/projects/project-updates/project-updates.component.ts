import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-updates',
  templateUrl: './project-updates.component.html',
  styleUrls: ['./project-updates.component.scss']
})
export class ProjectUpdatesComponent implements OnInit {

  @Input() id: string;

  constructor() {
  }

  ngOnInit() {
  }
}
