import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '@app/core/models/language';
import { Project, ProjectFilter, ProjectStatus, ProjectType } from '@app/core/models/project';
import { ProjectService } from '@app/core/services/project.service';
import { parseBoolean, TypedMatSort, TypedSort } from '@app/core/util';
import { observePagerAndSorter } from '@app/core/util/list-views';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import {
  defaultParamsFromChanges,
  defaultParseParams,
  PSChanges,
  QueryParams,
  RawQueryParams,
} from '@app/shared/components/table-view/table-view.component';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { TitleAware, TitleProp } from '../../core/decorators';

interface ListOption {
  label: string;
  value: boolean;
}

interface ProjectQueryParams extends QueryParams<keyof Project> {
  all: boolean;
}

interface ProjectViewOptions extends PSChanges<keyof Project, ProjectFilter> {
  list: ListOption;
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
@TitleAware()
export class ProjectListComponent extends SubscriptionComponent implements OnInit, TitleProp {

  readonly ProjectType = ProjectType;
  readonly ProjectStatus = ProjectStatus;

  readonly displayedColumns: Array<keyof Project> = ['name', 'updatedAt', 'languages', 'type', 'status'];
  readonly defaultSort: TypedSort<keyof Project> = {
    active: 'updatedAt',
    direction: 'desc',
  };
  readonly defaultPageSize = 10;

  readonly listSelectorOptions: ListOption[] = [
    {label: 'My Projects', value: true},
    {label: 'All Projects', value: false},
  ];
  readonly listChanges = new Subject<ListOption>();
  listSelection = this.listSelectorOptions[0];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  fetchProjects = this.projectService.getProjects;

  /**
   * Set list selection from query params
   */
  queryParamChanges(params: ProjectQueryParams) {
    if (params.all) {
      this.listSelection = this.listSelectorOptions[1];
      // Emit change to keep distinctUntilChanged happy in stream below
      this.listChanges.next(this.listSelection);
    }
  }

  /**
   * If my projects are empty and user hasn't manually specified my projects list,
   * then show all projects instead.
   */
  dataFetched(total: number) {
    if (total > 0 || this.route.snapshot.queryParamMap.has('all')) {
      return;
    }
    this.router.navigate(['.'], {
      queryParams: { all: true },
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  /**
   * Add all vs my list to changes to watch for.
   */
  observeChanges = (
    sorter: TypedMatSort<keyof Project>,
    paginator: MatPaginator,
    filters$: Observable<ProjectFilter>,
  ): Observable<ProjectViewOptions> => {
    const list$ = this.listChanges.pipe(
      startWith(this.listSelection), // Start with current value
      distinctUntilChanged(), // Don't emit if no change
    );
    return observePagerAndSorter<[ListOption, ProjectFilter], keyof Project>(
      paginator,
      sorter,
      [list$, filters$],
      [this.listSelection, {}],
    )
      .pipe(
        map(({ sort, page, rest: [list, filters] }) => ({ sort, page, list, filters })),
      );
  };

  /**
   * Add `all` to parsing logic
   */
  parseParams = (raw: RawQueryParams<ProjectQueryParams>): ProjectQueryParams => ({
    ...defaultParseParams<keyof Project>(this.defaultSort, this.defaultPageSize)(raw),
    all: raw.all != null ? parseBoolean(raw.all) : false,
  });

  /**
   * Add `all` to parsing logic
   */
  paramsFromChanges = (changes: ProjectViewOptions): Partial<ProjectQueryParams> => {
    return {
      ...defaultParamsFromChanges<keyof Project, ProjectFilter>(this.defaultSort, this.defaultPageSize)(changes),
      all: !changes.list.value ? true : this.route.snapshot.queryParamMap.has('all') ? false : undefined,
    };
  };

  ngOnInit(): void {
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

  trackByValue(index: number, value: any) {
    return value;
  }
}
