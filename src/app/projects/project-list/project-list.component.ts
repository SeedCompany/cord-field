import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { ProjectService } from '../../core/services/project.service';
import { ProjectSearchService } from '../project-search.service';

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
export class ProjectListComponent implements OnInit, AfterViewInit, OnDestroy {
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

  searchResults: Subscription;
  private backgroundColor = {
    active: 'green',
    rejected: 'red',
    suspended: 'gray',
    completed: 'green',
    archived: 'red',
    'pending approval': 'yellow',
    'in development': 'yellow'
  };

  constructor(private projectService: ProjectService,
              private projectSearchService: ProjectSearchService) {
    this.searchResults = this.projectSearchService.searchCriteria.subscribe(query => {
      this.projectSource.filter = (query || '').trim().toLowerCase();
    });
  }

  ngAfterViewInit() {
    this.projectSource.paginator = this.paginator;
    this.projectSource.sort = this.sort;
  }

  ngOnInit() {
    this.projectSource = new MatTableDataSource<Element>(this.projectService.getProjects());
  }

  ngOnDestroy() {
    this.searchResults.unsubscribe();
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


