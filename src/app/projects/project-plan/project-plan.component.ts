import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-plan',
  templateUrl: './project-plan.component.html',
  styleUrls: ['./project-plan.component.scss'],
})
export class ProjectPlanComponent implements OnInit {

  @Input() id: string;

  constructor() {
  }

  ngOnInit() {
  }
}
