/* tslint:disable:member-ordering */
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterContentInit, Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatTableDataSource, PageEvent, SortDirection } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { filterEntries, twoWaySync, TypedMatSort, TypedSort } from '@app/core/util';
import { observePagerAndSorter } from '@app/core/util/list-views';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { TableFilterDirective, TableViewFilters } from '@app/shared/components/table-view/table-filter.directive';
import { combineLatest, from, Observable, ObservableInput } from 'rxjs';
import { map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';

export interface QueryParams<TKeys> {
  sort: TKeys;
  dir: SortDirection;
  page: number; // 1-indexed to make more sense for users
  size: number;
}

export type RawQueryParams<Params extends QueryParams<any> = QueryParams<any>> = Partial<Record<keyof Params, string>>;

export interface PSChanges<TKeys extends string, Filters> {
  sort: TypedSort<TKeys>;
  page: PageEvent;
  filters: Filters;
}

export type FetchDataResult<T> = ObservableInput<{ data: T[], total: number }>;

export const defaultParseParams = <TKeys extends string>(defaultPageSize: number) => (raw: RawQueryParams): QueryParams<TKeys> => ({
  sort: raw.sort as TKeys,
  dir: raw.dir as SortDirection,
  page: raw.page ? Number(raw.page) : 1,
  size: raw.size ? Number(raw.size) : defaultPageSize,
});

export const defaultParamsFromChanges = <TKeys extends string, Filters>(defaultSort: TypedSort<TKeys>, defaultPageSize: number) =>
  ({ sort, page }: PSChanges<TKeys, Filters>): Partial<QueryParams<TKeys>> => {
    return {
      sort: sort.active !== defaultSort.active ? sort.active : undefined,
      dir: sort.direction !== defaultSort.direction ? sort.direction : undefined,
      page: page.pageIndex > 0 ? (page.pageIndex + 1) : undefined,
      size: page.pageSize !== defaultPageSize ? page.pageSize : undefined,
    };
  };

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
  animations: [
    trigger('slideRight', [
      state('shown', style({ transform: 'translateX(0)' })),
      state('hidden', style({ transform: 'translateX(200%)' })),
      transition('shown <=> hidden', animate('200ms ease-out')),
    ]),
  ],
})
export class TableViewComponent<T,
  TKeys extends string,
  Filters,
  Changes extends PSChanges<TKeys, Filters>,
  Params extends QueryParams<TKeys>> extends SubscriptionComponent implements AfterContentInit {

  @Input() defaultSort: TypedSort<TKeys>;
  @Input() defaultPageSize = 10;
  @Input() pageSizeOptions = [10, 25, 50];
  @Input() fetchData: (params: Params, filters: Filters) => FetchDataResult<T>;
  @Input() observeChanges = (sorter: TypedMatSort<TKeys>, paginator: MatPaginator, filters$: Observable<Filters>): Observable<Changes> => {
    return observePagerAndSorter<[Filters], TKeys>(
      paginator,
      sorter,
      [filters$],
      [{} as Filters],
    )
      .pipe(
        map(({ sort, page, rest: [filters] }) => ({ sort, page, filters }) as any),
      );
  };
  @Input() parseParams: (raw: RawQueryParams) => Params = (raw) => defaultParseParams(this.defaultPageSize)(raw) as Params;
  @Input() paramsFromChanges: (changes: Changes) => Partial<Params> = (changes) => {
    return defaultParamsFromChanges(this.defaultSort, this.defaultPageSize)(changes) as Params;
  };

  @Output() dataFetched = new EventEmitter<{ data: T[], total: number, filters: Filters }>();
  @Output() queryParamChanges = new EventEmitter<Params>();

  dataSource = new MatTableDataSource<T>();
  totalCount = 0;
  filtersActive = false;
  isLoading = true;

  @ContentChild(MatTable) table: MatTable<T>;
  @ContentChild(MatSort) sort: TypedMatSort<TKeys>;
  @ContentChild(TableFilterDirective) filtersComponent: TableViewFilters<Filters>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
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

        this.queryParamChanges.emit(params);
      });

    // Share filter stream so it can be used for pagination reset which goes to url and with fetching data stream
    const filters$ = this.filtersComponent.filters.pipe(shareReplay(1));

    this.observeChanges(this.sort, this.paginator, filters$)
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
      queryParams$.pipe(map(raw => this.parseParams(raw))),
      filters$,
    )
      .pipe(
        tap(() => this.isLoading = true),
        switchMap(([params, filters]) =>
          from(this.fetchData(params, filters))
            .pipe(
              map(result => ({ ...result, filters })),
            )),
        takeUntil(this.unsubscribe),
      )
      .subscribe(({ data, total, filters }) => {
        this.dataSource.data = data;
        this.totalCount = total;
        this.filtersActive = Object.keys(filters).length > 0;
        this.isLoading = false;
        this.dataFetched.emit({ data, total, filters });
      });
  }

  onClearFilters() {
    this.filtersComponent.reset();
  }
}
