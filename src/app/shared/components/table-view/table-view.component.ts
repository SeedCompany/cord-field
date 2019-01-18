/* tslint:disable:member-ordering */
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { AfterContentInit, AfterViewInit, Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  MatButton,
  MatDrawer,
  MatPaginator,
  MatSnackBar,
  MatSnackBarRef,
  MatSort,
  MatTable,
  MatTableDataSource,
  PageEvent,
  SimpleSnackBar,
  SortDirection,
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { filterEntries, twoWaySync, TypedMatSort, TypedSort } from '@app/core/util';
import { ListApi, observePagerAndSorter } from '@app/core/util/list-views';
import { SearchComponent } from '@app/shared/components/search/search.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { TableFilterDirective, TableViewFilters } from '@app/shared/components/table-view/table-filter.directive';
import { BehaviorSubject, combineLatest, from, merge, Observable, of, Subject } from 'rxjs';
import { catchError, first, map, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

export interface QueryParams<TKeys> {
  sort: TKeys;
  dir: SortDirection;
  page: number; // 1-indexed to make more sense for users
  size: number;
  search: string;
}

export type RawQueryParams<Params extends QueryParams<any> = QueryParams<any>> = Partial<Record<keyof Params, string>>;

export interface PSChanges<TKeys extends string, Filters> {
  sort: TypedSort<TKeys>;
  page: PageEvent;
  filters: Filters;
  search: string;
}

export const defaultParseParams = <TKeys extends string>(defaultSort: TypedSort<TKeys>, defaultPageSize: number) =>
  (raw: RawQueryParams): QueryParams<TKeys> => ({
    sort: raw.sort ? raw.sort as TKeys : defaultSort.active,
    dir: raw.dir ? raw.dir as SortDirection : defaultSort.direction,
    page: raw.page ? Number(raw.page) : 1,
    size: raw.size ? Number(raw.size) : defaultPageSize,
    search: raw.search || '',
  });

export const defaultParamsFromChanges = <TKeys extends string, Filters>(defaultSort: TypedSort<TKeys>, defaultPageSize: number) =>
  ({ sort, page, search }: PSChanges<TKeys, Filters>): Partial<QueryParams<TKeys>> => {
    return {
      sort: sort.active !== defaultSort.active ? sort.active : undefined,
      dir: sort.direction !== defaultSort.direction ? sort.direction : undefined,
      page: page.pageIndex > 0 ? (page.pageIndex + 1) : undefined,
      size: page.pageSize !== defaultPageSize ? page.pageSize : undefined,
      search: search || undefined,
    };
  };

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
  animations: [
    trigger('slideRight', [
      state('shown', style({ transform: 'translateX(0)' })),
      state('hidden', style({ transform: 'translateX(56px)' })), // 56px = 40px icon width + 16px toolbar padding
      transition('shown <=> hidden', [
        group([
          query('@addPadding', animateChild()),
          animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
        ]),
      ]),
    ]),
    trigger('addPadding', [
      state('shown', style({ marginLeft: 0 })),
      state('hidden', style({ marginLeft: '16px' })), // 16px toolbar padding
      transition('shown <=> hidden', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
  ],
})
export class TableViewComponent<T,
  TKeys extends string,
  Filters,
  Changes extends PSChanges<TKeys, Filters>,
  Params extends QueryParams<TKeys>> extends SubscriptionComponent implements AfterContentInit, AfterViewInit {

  @Input() defaultSort: TypedSort<TKeys>;
  @Input() defaultPageSize = 10;
  @Input() pageSizeOptions = [10, 25, 50];
  @Input() search = false;
  @Input() fetchData: ListApi<T, TKeys, Filters, Params & { filters: Filters }>;
  @Input() otherChanges = {};
  @Input() observeChanges = (
    sorter: TypedMatSort<TKeys>,
    paginator: MatPaginator,
    filters$: Observable<Filters>,
    search$: Observable<string>,
  ): Observable<Changes> => {
    return observePagerAndSorter<[string, Filters], TKeys>(
      paginator,
      sorter,
      [search$, filters$],
      ['', {} as Filters],
    )
      .pipe(
        map(({ sort, page, rest: [search, filters] }) => ({ sort, page, search, filters }) as any),
      );
  };
  @Input() parseParams: (raw: RawQueryParams) => Params = (raw) =>
    defaultParseParams(this.defaultSort, this.defaultPageSize)(raw) as Params;
  @Input() paramsFromChanges: (changes: Changes) => Partial<Params> = (changes) => {
    return defaultParamsFromChanges(this.defaultSort, this.defaultPageSize)(changes) as Params;
  };

  @Output() dataFetched = new EventEmitter<{ data: T[], total: number, filters: Filters }>();
  @Output() queryParamChanges = new EventEmitter<Params>();

  dataSource = new MatTableDataSource<T>();
  totalCount = 0;
  filtersActive = false;
  isLoading = true;
  refresh = new Subject<void>();
  search$ = new BehaviorSubject('');

  @ContentChild(MatTable) table: MatTable<T>;
  @ContentChild(MatSort) sort: TypedMatSort<TKeys>;
  @ContentChild(TableFilterDirective) filtersComponent: TableViewFilters<Filters> | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Since the search component is conditionally shown based on the `search` input, we don't get the component
  // until AfterViewInit. So I'm using a BehaviorSubject to bridge the changes and stream setup in AfterContentInit
  @ViewChild(SearchComponent) set searchInput(input: SearchComponent | null) {
    if (!input) {
      return;
    }
    input.search
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.search$);
  }
  @ViewChild('filterDrawer') filterDrawer: MatDrawer;
  @ViewChild('openDrawerButton') openDrawerButton: MatButton;
  @ViewChild('closeDrawerButton') closeDrawerButton: MatButton;

  private errorRef: MatSnackBarRef<SimpleSnackBar> | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  get hasFilters() {
    return Boolean(this.filtersComponent);
  }

  ngAfterContentInit(): void {
    this.table.dataSource = this.dataSource;

    const queryParams$ = this.route.queryParams as Observable<RawQueryParams>;

    const [changingQueryParams, rejectProgrammaticQueryParamChanges] = twoWaySync();

    // Change options when query params change
    queryParams$
      .pipe(
        rejectProgrammaticQueryParamChanges,
        map(raw => this.parseParams(raw)),
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

        if (this.search && params.search) {
          this.search$.next(params.search);
        }

        this.queryParamChanges.emit(params);
      });

    // Share filter stream so it can be used for pagination reset which goes to url and with fetching data stream
    const filters$ = this.hasFilters
      ? this.filtersComponent!.filters.pipe(shareReplay(1))
      : of({} as Filters);

    this.observeChanges(this.sort, this.paginator, filters$, this.search$)
      .pipe(
        map((changes): Partial<Params> => {
          const params = this.paramsFromChanges(changes);
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
      queryParams$.pipe(
        map(raw => this.search ? raw : { ...raw, search: '' }), // Don't send search if it's not enabled.
        map(raw => this.parseParams(raw)),
      ),
      filters$,
      this.refresh.pipe(startWith(null)),
    )
      .pipe(
        tap(() => this.isLoading = true),
        switchMap(([params, filters]) =>
          // tslint:disable-next-line:prefer-object-spread
          from(this.fetchData(Object.assign(params, { filters })))
            .pipe(
              catchError((error) => of({ data: [], total: 0, error })),
              map(result => ({ error: null, ...result, filters })),
            )),
        takeUntil(this.unsubscribe),
      )
      .subscribe(({ error, data, total, filters }) => {
        this.dataSource.data = data;
        this.totalCount = total;
        this.filtersActive = Object.keys(filters).length > 0;
        this.isLoading = false;
        if (!error) {
          this.dataFetched.emit({ data, total, filters });
          return;
        }

        // Open snackbar message
        this.errorRef = this.snackBar.open('Failed to fetch list from server', 'TRY AGAIN');
        // Trigger refresh on action
        this.errorRef.onAction().pipe(takeUntil(this.unsubscribe)).subscribe(() => this.refresh.next());
        // Dismiss the error on first refresh or component destroy
        merge(this.refresh, this.unsubscribe).pipe(first()).subscribe(() => {
          this.errorRef!.dismiss();
          this.errorRef = null;
        });
      });
  }

  ngAfterViewInit(): void {
    this.filterDrawer.openedChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(opened => {
        const button = opened ? this.closeDrawerButton : this.openDrawerButton;
        button.focus();
      });
  }

  onClearFilters() {
    if (this.filtersComponent) {
      this.filtersComponent.reset();
    }
  }
}
