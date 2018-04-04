import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ProjectService } from '../../core/services/project.service';

export interface Element {
  name: string;
  lastModified: number;
  type: string;
  languages: string[];
  status: string;
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'lastModified', 'languages', 'type', 'status'];
  projectTitle = 'my projects';
  pageSize = 10;
  pageSizeOptions = [5, 10, 20];
  projectSource;
  projects = [
    'my projects',
    'all projects'
  ];
  projectTypes = [
    'internship',
    'translation',
    'partner capacity'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private backgroundColor = {
    active: 'green',
    rejected: 'red',
    suspended: 'gray',
    completed: 'green',
    archived: 'red',
    'pending approval': 'yellow',
    'in development': 'yellow'
  };

  constructor(
    private projectService: ProjectService
  ) {}

  ngAfterViewInit() {
    this.projectSource.paginator = this.paginator;
    this.projectSource.sort = this.sort;
  }

  ngOnInit() {
    this.projectSource = new MatTableDataSource<Element>(this.projectService.getProjects());
  }

  onSearch(query: string) {
    this.projectSource.filter = query;
  }

  setMenuItem(projectTitle) {
    this.projectTitle = projectTitle;
  }

  getColor(status) {
    return this.backgroundColor[status] || 'red';
  }

  trackByFn(index, project) {
    return index;
  }
}


