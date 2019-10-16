import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '@app/core/models/language';
import { Project, ProjectFilter, ProjectStatus } from '@app/core/models/project';
import { ProjectService } from '@app/core/services/project.service';
import { ObservablesWithInitialMapping, parseBoolean, TypedSort } from '@app/core/util';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import {
  defaultParamsFromChanges,
  defaultParseParams,
  PSChanges,
  QueryParams,
  RawQueryParams,
} from '@app/shared/components/table-view/table-view.component';
import { Subject } from 'rxjs';
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

  readonly ProjectStatus = ProjectStatus;

  readonly displayedColumns: Array<keyof Project> = ['name', 'updatedAt', 'languages', 'status'];
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
  extraInputs: ObservablesWithInitialMapping<{list: ListOption}> = {
    list: {
      stream: this.listChanges.pipe(
        startWith(this.listSelection), // Start with current value
        distinctUntilChanged(), // Don't emit if no change
      ),
      initial: this.listSelection,
    },
  };

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
      queryParams: { all: false },
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

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
