import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Project, ProjectFilter, ProjectStatus, ProjectsWithCount, ProjectType } from '../../core/models/project';
import { ProjectService } from '../../core/services/project.service';
import { ProjectListFilterComponent } from './project-list-filter/project-list-filter.component';

interface ListOption {
  label: string;
  value: boolean;
}

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

  listSelector: BehaviorSubject<ListOption>;
  listSelectorOptions: ListOption[] = [
    {label: 'My Projects', value: true},
    {label: 'All Projects', value: false}
  ];

  readonly displayedColumns = ['name', 'updatedAt', 'languages', 'type', 'status'];
  readonly pageSizeOptions = [10, 25, 50];
  projectSource = new MatTableDataSource<Project>();
  totalCount = 0;
  filtersActive = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ProjectListFilterComponent) filtersComponent: ProjectListFilterComponent;

  constructor(private projectService: ProjectService) {
    this.listSelector = new BehaviorSubject(this.listSelectorOptions[0]);
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
          .startWith({}),
        this.listSelector
      )
      .switchMap(([sort, page, filters, listSelector]: [Sort, PageEvent, ProjectFilter, ListOption]) => {
        this.filtersActive = Object.keys(filters).length > 0;

        return this.projectService.getProjects(
          sort.active as keyof Project,
          sort.direction,
          page.pageIndex * page.pageSize,
          page.pageSize,
          filters,
          listSelector.value
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

  trackByValue(index: number, value: any) {
    return value;
  }
}
