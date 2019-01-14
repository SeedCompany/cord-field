import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, SortDirection } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { filterEntries, parseBoolean, twoWaySync, TypedMatSort } from '@app/core/util';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { combineLatest, Observable, of as observableOf, Subject } from 'rxjs';
import { distinctUntilChanged, map, skip, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TitleAware, TitleProp } from '../../core/decorators';
import { Language } from '../../core/models/language';
import { Project, ProjectStatus, ProjectType } from '../../core/models/project';
import { ProjectService } from '../../core/services/project.service';
import { ProjectListFilterComponent } from './project-list-filter/project-list-filter.component';

interface ListOption {
  label: string;
  value: boolean;
}

interface QueryParams {
  sort?: keyof Project;
  dir?: SortDirection;
  page?: number; // 1-indexed to make more sense for users
  size?: number;
  all?: boolean;
}

type RawQueryParams = Partial<Record<keyof QueryParams, string>>;

const parseParams = (raw: RawQueryParams): QueryParams => ({
  sort: raw.sort as keyof Project,
  dir: raw.dir as SortDirection,
  page: raw.page ? Number(raw.page) : undefined,
  size: raw.size ? Number(raw.size) : undefined,
  all: raw.all != null ? parseBoolean(raw.all) : undefined,
});

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    trigger('slideRight', [
      state('shown', style({transform: 'translateX(0)'})),
      state('hidden', style({transform: 'translateX(200%)'})),
      transition('shown <=> hidden', animate('200ms ease-out')),
    ]),
  ],
})
@TitleAware()
export class ProjectListComponent extends SubscriptionComponent implements OnInit, TitleProp {

  readonly ProjectType = ProjectType;
  readonly ProjectStatus = ProjectStatus;

  listSelectorOptions: ListOption[] = [
    {label: 'My Projects', value: true},
    {label: 'All Projects', value: false},
  ];
  listSelection = this.listSelectorOptions[0];
  listChanges = new Subject<ListOption>();

  readonly displayedColumns: Array<keyof Project> = ['name', 'updatedAt', 'languages', 'type', 'status'];
  readonly defaultSort = {
    active: 'updatedAt' as keyof Project,
    direction: 'desc' as SortDirection,
  };
  readonly defaultPageSize = 10;
  readonly pageSizeOptions = [10, 25, 50];
  readonly apiFields: Array<keyof Project> = ['id', ...this.displayedColumns];

  projectSource = new MatTableDataSource<Project>();
  totalCount = 0;
  filtersActive = false;
  isLoading = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: TypedMatSort<keyof Project>;
  @ViewChild(ProjectListFilterComponent) filtersComponent: ProjectListFilterComponent;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    const queryParams$ = this.route.queryParams as Observable<RawQueryParams>;

    const [changingQueryParams, rejectProgrammaticQueryParamChanges] = twoWaySync();

    // Change options when query params change
    queryParams$
      .pipe(
        rejectProgrammaticQueryParamChanges,
        map(parseParams),
        takeUntil(this.unsubscribe),
      )
      .subscribe(params => {
        this.sort.active = params.sort || this.defaultSort.active;
        this.sort.direction = (params.dir || this.defaultSort.direction) as SortDirection;

        if (params.page && params.page > 1) {
          this.paginator.pageIndex = params.page - 1;
        }
        if (params.size) {
          this.paginator.pageSize = params.size;
        }

        if (params.all) {
          this.listSelection = this.listSelectorOptions[1];
          // Emit change to keep distinctUntilChanged happy in stream below
          this.listChanges.next(this.listSelection);
        }
      });

    // Change query params when options change
    combineLatest(
      this.sort.sortChange
        .pipe(
          tap(() => this.paginator.pageIndex = 0),
          startWith({active: this.sort.active, direction: this.sort.direction}),
        ),
      this.paginator.page
        .pipe(startWith({
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          length: this.paginator.length,
        } as PageEvent)),
      this.listChanges.pipe(
        startWith(this.listSelection), // Start with current value
        distinctUntilChanged(), // Don't emit if no change
      ),
    )
      .pipe(
        skip(1), // We don't need to navigate for initial data since there will be no changes.
        map(([sort, page, listSelection]): QueryParams => {
          const params = {
            sort: sort.active !== this.defaultSort.active ? sort.active : undefined,
            dir: sort.direction !== this.defaultSort.direction ? sort.direction : undefined,
            page: page.pageIndex > 0 ? (page.pageIndex + 1) : undefined,
            size: page.pageSize !== this.defaultPageSize ? page.pageSize : undefined,
            all: !listSelection.value ? true : this.route.snapshot.queryParamMap.has('all') ? false : undefined,
          };
          return filterEntries(params, (key, value) => value != null);
        }),
        takeUntil(this.unsubscribe),
        changingQueryParams,
      )
      .subscribe(queryParams => {
        this.router.navigate(['.'], {
          queryParams,
          relativeTo: this.route,
          // We want to keep state in case user wants to jump back to this state,
          // but we don't want to flood the history with interactions on this view.
          // That would make it hard for the user to return to the previous view.
          replaceUrl: true,
        });
      });

    // Fetch data from query params & filters
    combineLatest(
      queryParams$.pipe(map(parseParams)),
      this.filtersComponent.filters,
    )
      .pipe(
        switchMap(([params, filters]) => {
          const {
            sort = this.sort.active,
            dir = this.sort.direction,
            page = 1,
            size = 10,
            all = false,
          } = params;

          this.isLoading = true;
          const projects = this.projectService.getProjects(
            sort,
            dir,
            (page - 1) * size,
            size,
            filters,
            this.apiFields,
            !all,
          );

          return combineLatest(
            projects,
            observableOf(filters),
          );
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe(([{ projects, count }, filters]) => {
        this.projectSource.data = projects;
        this.totalCount = count;
        this.filtersActive = Object.keys(filters).length > 0;
        this.isLoading = false;

        // If my projects are empty and user hasn't manually specified my projects list, then show all projects instead.
        if (count === 0 && !this.route.snapshot.queryParamMap.has('all')) {
          this.router.navigate(['.'], {
            queryParams: { all: true },
            relativeTo: this.route,
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        }
      });

    // Hook up list clicks
    this.listChanges
      .pipe(
        takeUntil(this.unsubscribe),
      )
      .subscribe(selection => {
        this.listSelection = selection;
      });
  }

  get title() {
    return this.listChanges
      .pipe(
        startWith(this.listSelection),
        map(selection => selection.label),
      );
  }

  onLanguageClick(language: Language) {
    this.router.navigate(['/languages', language.id]);
  }

  onClearFilters() {
    this.filtersComponent.reset();
  }

  trackByValue(index: number, value: any) {
    return value;
  }
}
