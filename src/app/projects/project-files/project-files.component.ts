import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-files',
  templateUrl: './project-files.component.html',
  styleUrls: ['./project-files.component.scss'],
})
export class ProjectFilesComponent implements OnInit {

  @Input() id: string;

  constructor() {
  }

  ngOnInit() {
  }
}
