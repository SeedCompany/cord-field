import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Language } from '../../core/models/language';
import { Project, ProjectFilter, ProjectStatus, ProjectsWithCount, ProjectType } from '../../core/models/project';
import { ProjectService } from '../../core/services/project.service';
import { ProjectCreateDialogComponent } from '../project-create-dialog/project-create-dialog.component';
import { ProjectListFilterComponent } from './project-list-filter/project-list-filter.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    trigger('slideRight', [
      state('shown', style({transform: 'translateX(0)'})),
      state('hidden', style({transform: 'translateX(200%)'})),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ])
  ]
})
export class ProjectListComponent implements AfterViewInit {

  readonly ProjectType = ProjectType;
  readonly ProjectStatus = ProjectStatus;

  currentListSelector = 'All Projects';
  listSelectorOptions = [
    'All Projects',
    'My Projects'
  ];

  readonly displayedColumns = ['name', 'updatedAt', 'languages', 'type', 'status'];
  readonly pageSizeOptions = [10, 25, 50];
  projectSource = new MatTableDataSource<Project>();
  totalCount = 0;
  filtersActive = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ProjectListFilterComponent) filtersComponent: ProjectListFilterComponent;

  constructor(private dialog: MatDialog,
              private projectService: ProjectService) {
  }

  ngAfterViewInit() {
    Observable
      .combineLatest(
        this.sort.sortChange
          .do(() => this.paginator.pageIndex = 0)
          .startWith({active: 'updated', direction: 'desc'} as Sort),
        this.paginator.page
          .startWith({pageIndex: 0, pageSize: 10, length: 0} as PageEvent),
        this.filtersComponent.filters
          .startWith({})
      )
      .switchMap(([sort, page, filters]: [Sort, PageEvent, ProjectFilter]) => {
        this.filtersActive = Object.keys(filters).length > 0;

        return this.projectService.getProjects(
          sort.active as keyof Project,
          sort.direction,
          page.pageIndex * page.pageSize,
          page.pageSize,
          filters
        );
      })
      .subscribe((data: ProjectsWithCount) => {
        this.totalCount = data.count;
        this.projectSource.data = data.projects;
      });
  }

  onClearFilters() {
    this.filtersComponent.reset();
  }

  openDialog(): void {
    this.dialog.open(ProjectCreateDialogComponent, {
      width: '400px'
    });
  }

  trackByValue(index: number, value: any) {
    return value;
  }

  trackLanguageById(index: number, language: Language): string {
    return language.id;
  }
}
