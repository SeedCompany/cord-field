import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Project, ProjectStatus, projectStatusToString, projectTypeToString } from '../../core/models/project';
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

  projectSource: MatTableDataSource<Project>;
  displayedColumns = ['name', 'lastModified', 'languages', 'type', 'status'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 20];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly projectTypeToString = projectTypeToString;
  readonly projectStatusToString = projectStatusToString;

  private statusColor = {
    [ProjectStatus.Active]: 'green',
    [ProjectStatus.Rejected]: 'red',
    [ProjectStatus.Completed]: 'green',
    [ProjectStatus.Inactive]: 'red',
    [ProjectStatus.InDevelopment]: 'orange'
  };

  constructor(private projectService: ProjectService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this
      .projectService
      .getProjects()
      .subscribe(projects => {
      this.projectSource = new MatTableDataSource<Project>(projects);
      this.projectSource.paginator = this.paginator;
      this.projectSource.sort = this.sort;
    }, err => console.log(err));
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
      console.log(result);
    });
  }

  trackByValue(index, value) {
    return value;
  }
}
