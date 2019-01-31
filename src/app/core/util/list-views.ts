import { HttpResponse } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material';
import { HttpParams } from '@app/core/services/http/abstract-http-client';
import { PloApiService } from '@app/core/services/http/plo-api.service';
import { TypedMatSort, TypedSort } from '@app/core/util/material-types';
import { combineLatestPreInitialized, ObservablesWithInitialMapping, ObservableWithInitial } from '@app/core/util/rxjs-operators';
import { QueryParams } from '@app/shared/components/table-view/table-view.component';
import { mapValues } from 'lodash-es';
import { combineLatest, Observable } from 'rxjs';
import { map, skip, startWith, tap } from 'rxjs/operators';

export type ListApi<T, Keys, Filters, Options extends ApiOptions<Keys, Filters>> =
  (options: Options) => Observable<{ data: T[], total: number }>;

export interface ApiOptions<Keys, Filters> extends QueryParams<Keys> {
  filters: Filters;
}

export const listApi = <T, Keys extends string, Filters, BodyItem = T>(
  plo: PloApiService,
  url: string,
  parser: (item: BodyItem) => T,
  buildFilters: (filters: Filters) => any,
  fields?: Keys[],
) => (options: ApiOptions<Keys, Filters>) => makeListRequest(plo, url, parser)(listOptionsToHttpParams(buildFilters, fields)(options));

export const listOptionsToHttpParams = <Keys extends string, Filters>(buildFilters: (filters: Filters) => any, fields?: Keys[]) =>
  (options: ApiOptions<Keys, Filters>) => {
    const params: HttpParams = {
      sort: options.sort,
      order: options.dir,
      limit: options.size.toString(),
    };
    if (fields) {
      params.fields = JSON.stringify(fields);
    }
    const skip2 = (options.page - 1) * options.size;
    if (skip2 > 0) {
      params.skip = skip2.toString();
    }
    if (options.filters && Object.keys(options.filters).length > 0) {
      params.filter = JSON.stringify(buildFilters(options.filters));
    }
    if (options.search) {
      params.search = options.search;
    }

    return params;
  };

export const makeListRequest = <T, BodyItem = T>(plo: PloApiService, url: string, parser: (item: BodyItem) => T) =>
  (params: HttpParams) => {
    return plo.get<BodyItem[]>(url, { params, observe: 'response' })
      .pipe(
        map((response: HttpResponse<BodyItem[]>) => ({
          data: (response.body || []).map(parser),
          total: Number(response.headers.get('x-sc-total-count')) || 0,
        })),
      );
  };

/**
 * Observes pager and sorter changes and other changes passed in as well.
 * Handles pager non-sense and sends back.
 */
export function observePagerAndSorter<OtherChanges, K extends string>(
  paginator: MatPaginator,
  sorter: TypedMatSort<K>,
  otherChanges: ObservablesWithInitialMapping<OtherChanges>,
): Observable<OtherChanges & { sort: TypedSort<K>, page: PageEvent }> {
  const initialSort: TypedSort<K> = { active: sorter.active, direction: sorter.direction };

  // Combine stream of option changes that require a pagination reset, and trigger that on change
  const optionChangesMinusPagination = (combineLatestPreInitialized({
    ...otherChanges,
    sort: { stream: sorter.sortChange, initial: initialSort },
  }) as Observable<{ sort: TypedSort<K> } & OtherChanges>)
    .pipe(
      // On list, sort, or filter changes reset the current page
      tap(() => paginator.pageIndex = 0),
    );

  // Combine partial option changes with pagination changes
  const otherInitial = mapValues(otherChanges, (i: ObservableWithInitial<any>) => i.initial) as OtherChanges;
  return mergePaginator(
    optionChangesMinusPagination
      .pipe(
        startWith({ ...otherInitial, sort: initialSort }),
      ),
    paginator,
  );
}

/**
 * Merge pagination in with other options. Options stream needs to have a startsWith.
 */
function mergePaginator<T>(options: Observable<T>, paginator: MatPaginator): Observable<T & { page: PageEvent }> {
  // Combine partial option changes with pagination changes
  return combineLatest(
    options,
    paginator.page
      .pipe(
        startWith(null), // value doesn't matter since we aren't using it
      ),
  )
    .pipe(
      // Skip starting value needed to get combine latest initialized
      skip(1),
      // Ignore page data from page event as combineLatest could yield a stale value
      // when options change and reset the page index.
      // It's important that we still combine the page stream in so that pagination changes from UI take affect.
      map(([opts]) => {
        const page: PageEvent = {
          pageIndex: paginator.pageIndex,
          pageSize: paginator.pageSize,
          length: paginator.length,
        };
        return { ...opts, page };
      }),
    );
}
