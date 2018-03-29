import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-budget',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.scss']
})
export class ProjectBudgetComponent implements OnInit {

  @Input() id: string;

  constructor() {
  }

  ngOnInit() {
  }
}
