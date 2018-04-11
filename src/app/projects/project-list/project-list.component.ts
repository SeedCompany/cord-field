import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Project, ProjectStatus, projectStatusToString, ProjectsWithCount, projectTypeToString } from '../../core/models/project';
import { ProjectService } from '../../core/services/project.service';
import { ProjectCreateDialogComponent, ProjectCreationResult } from '../project-create-dialog/project-create-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements AfterViewInit {
  currentListSelector = 'All Projects';
  listSelectorOptions = [
    'All Projects',
    'My Projects'
  ];
  readonly displayedColumns = ['name', 'updatedAt', 'languages', 'type', 'status'];
  readonly pageSizeOptions = [10, 25, 50];
  projectSource = new MatTableDataSource<Project>();
  totalCount = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly projectTypeToString = projectTypeToString;
  readonly projectStatusToString = projectStatusToString;
  private readonly statusColor = {
    [ProjectStatus.Active]: 'green',
    [ProjectStatus.Inactive]: 'red',
    [ProjectStatus.InDevelopment]: 'orange'
  };

  constructor(private dialog: MatDialog,
              private projectService: ProjectService,
              private router: Router) {
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    Observable
      .merge(this.sort.sortChange, this.paginator.page)
      .startWith({})
      .switchMap(() => {
        return this.projectService.getProjects(
          this.sort.active as keyof Project,
          this.sort.direction,
          this.paginator.pageIndex * this.paginator.pageSize,
          this.paginator.pageSize
        );
      })
      .subscribe((data: ProjectsWithCount) => {
        this.totalCount = data.count;
        this.projectSource.data = data.projects;
      });
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
      this.projectService.createProject(result)
        .then(id => this.router.navigate(['/projects', id]));

    });
  }

  trackByValue(index, value) {
    return value;
  }
}
