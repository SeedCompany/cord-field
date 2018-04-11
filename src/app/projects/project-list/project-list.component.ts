import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { Project, ProjectStatus } from '../../core/models/project';
import { LoggerService } from '../../core/services/logger.service';
import { ProjectService } from '../../core/services/project.service';
import { ProjectCreateDialogComponent, ProjectCreationResult } from '../project-create-dialog/project-create-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  currentListSelector = 'All Projects';
  listSelectorOptions = [
    'All Projects',
    'My Projects'
  ];
  projectSource = new MatTableDataSource<Project>();
  displayedColumns = ['name', 'lastModified', 'languages', 'type', 'status'];
  pageSize = 10;
  totalCount = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private statusColor = {
    [ProjectStatus.Active]: 'green',
    [ProjectStatus.Inactive]: 'red',
    [ProjectStatus.InDevelopment]: 'orange'
  };

  constructor(private dialog: MatDialog,
              private log: LoggerService,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.getProjects();
  }

  onSearch(query: string) {
    this.projectSource.filter = query;
  }

  getStatusColor(status: ProjectStatus) {
    return this.statusColor[status];
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProjectCreateDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result?: ProjectCreationResult) => {
      if (!result) {
        return;
      }
    });
  }

  trackByValue(index, value) {
    return value;
  }

  getProjects() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this
            .projectService
            .getProjects(this.getSortFieldName(this.sort),
              this.sort.direction,
              this.paginator.pageIndex * this.pageSize,
              this.pageSize);
        }),
        map(projectsWithCount => {
          this.totalCount = projectsWithCount.count;
          return projectsWithCount.projects;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(projects => this.projectSource.data = projects);
  }

  getSortFieldName(sort) {
    return sort.active === 'lastModified' ? 'updatedAt' : sort.active;
  }

}
