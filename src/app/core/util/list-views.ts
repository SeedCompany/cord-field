import { MatPaginator, PageEvent } from '@angular/material';
import { TypedMatSort } from '@app/core/util/material-types';
import { combineLatest, Observable, ObservableInput } from 'rxjs';
import { map, skip, startWith, tap } from 'rxjs/operators';

/**
 * Observes pager and sorter changes and other changes passed in as well.
 * Handles pager non-sense and sends back.
 */
export function observePagerAndSorter<OtherChanges, K extends string>(
  paginator: MatPaginator,
  sorter: TypedMatSort<K>,
  otherChangeStreams: Array<ObservableInput<any>>,
  otherChangeStartingValue: OtherChanges,
): Observable<{ sort: TypedMatSort<K>, page: PageEvent, rest: OtherChanges }> {
  const initialSort = { active: sorter.active, direction: sorter.direction };

  // Combine stream of option changes that require a pagination reset, and trigger that on change
  const optionChangesMinusPagination = combineLatest(
    sorter.sortChange
      .pipe(
        startWith(initialSort),
      ),
    ...otherChangeStreams,
  )
    .pipe(
      // We don't need to navigate for initial data since there will be no changes.
      // It's important to skip this first event, else the page will be reset on initial load
      skip(1),
      // On list, sort, or filter changes reset the current page
      tap(() => paginator.pageIndex = 0),
      // Map to object so it's easier to remember
      map(([sort, ...rest]) => ({ sort, rest })),
    );

  // Combine partial option changes with pagination changes
  return mergePaginator(
    optionChangesMinusPagination
      .pipe(
        startWith({ sort: initialSort, rest: otherChangeStartingValue }),
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
        // tslint:disable-next-line:prefer-object-spread no it doesn't work with generics on TS below 3.2
        return Object.assign(opts, { page });
      }),
    );
}
