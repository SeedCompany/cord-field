import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ProjectSearchService } from '../project-search.service';

@Component({
  selector: 'app-project-list-search',
  templateUrl: './project-list-search.component.html',
  styleUrls: ['./project-list-search.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({width: 0}),
        animate('200ms ease-in')
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({width: 0}))
      ])
    ])
  ]
})
export class ProjectListSearchComponent implements OnInit {
  query = '';
  focused = false;

  constructor(private projectSearchService: ProjectSearchService) {

  }

  ngOnInit() {
  }

  searchUpdated(input) {
    this
      .projectSearchService
      .sendMessage(input);
  }
}
