import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import {
  Project,
  ProjectStatus
} from '../../core/models/project';
import { LoggerService } from '../../core/services/logger.service';
import { ProjectService } from '../../core/services/project.service';
import {
  ProjectCreateDialogComponent,
  ProjectCreationResult
} from '../project-create-dialog/project-create-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  currentListSelector = 'All Projects';
  listSelectorOptions = [
    'All Projects',
    'My Projects'
  ];
  projectSource = new MatTableDataSource<Project>();
  displayedColumns = ['name', 'lastModified', 'languages', 'type', 'status'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 20];

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
    this.getProjects('updatedAt', 0, this.pageSize);
  }

  ngAfterViewInit() {
    this.projectSource.sort = this.sort;
    this.projectSource.paginator = this.paginator;
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

  getProjects(sort, skip, limit) {
    this
      .projectService
      .getProjects(sort, skip, limit)
      .subscribe(projects => {
        this.projectSource.data = projects;
      }, err => {
        this.log.error(err, 'ProjectListComponent.getProjects');
      });
  }

  onPaginatorChange(event) {
    const skip = event.pageIndex * event.pageSize;
    this.getProjects('updatedAt', skip, event.pageSize);
  }
}
