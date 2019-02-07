import { FormGroup } from '@angular/forms';
import { zipObject } from 'lodash-es';
import { combineLatest, EMPTY, from, Observable, ObservableInput, of } from 'rxjs';
import { startWith } from 'rxjs/internal/operators/startWith';
import { isInteropObservable } from 'rxjs/internal/util/isInteropObservable';
import { isPromise } from 'rxjs/internal/util/isPromise';
import { filter, map, skip, tap } from 'rxjs/operators';
import { filterEntries, mapEntries, splitKeyValues } from './array-object-helpers';

export type MaybeObservable<T> = Observable<T> | Promise<T> | T;

export const maybeObservable = <T>(obs?: MaybeObservable<T>, defaultVal: Observable<T> = EMPTY): Observable<T> =>
  obs == null ? defaultVal :
    isInteropObservable(obs) || isPromise(obs) ? from(obs) : of(obs);

/**
 * An RXJs pipeable operator that filters form values to only ones that are valid.
 */
export const onlyValidValues = <T>(form: FormGroup) => (source: Observable<T>): Observable<Partial<T>> => {
  return source.pipe(map(values => filterEntries<Partial<T>>(values, key => form.get(key as string)!.valid)));
};

// Typescript can't figure this out via lambda with inferred types
export const filterRequired = <T>() => filter<T | null | undefined, T>(required);

function required<T>(val: T | null | undefined): val is T {
  return val != null;
}

export const log = <T>(...params: any[]) => (source: Observable<T>): Observable<T> => source.pipe(tap(value => {
  // tslint:disable-next-line:no-console
  console.log(...params, value);
}));

/**
 * Sometimes we need to observe two subjects which produce side effects for the other, a.k.a. two way syncing.
 * For example, we need to observe user changes on A, which then affect B. But B can also change A.
 * This would cause an infinite loop. To avoid this we need a flag to just ignore changes on A that come from B.
 * Thus this function returns a tuple:
 *   - The first item is an operator that sets the flag that we are making a change.
 *   - The second item is an operator that rejects the first change and resets the flag.
 *
 * This is inspired by React hooks. An array/tuple is returned to allow the caller to set the variable names
 * instead of a mapping which would clutter readability.
 */
export const twoWaySync = () => {
  let changing = false;
  const setChanging = <T>(source: Observable<T>) => source.pipe(tap(() => changing = true));
  const rejectChanges = <T2>(source: Observable<T2>) => source.pipe(filter(() => {
    if (changing) {
      changing = false;
      return false;
    }
    return true;
  }));
  return [setChanging, rejectChanges];
};

export const skipEmptyViewState = <T extends {id: string}>() => (source: Observable<T | null>): Observable<T> =>
  source.pipe(filter((sbj): sbj is T => Boolean(sbj) && Boolean(sbj!.id)));

export type ItemsToObservableInput<T> = { [K in keyof T]: ObservableInput<T[K]> };

/**
 * Just like combineLatest, except input/output is a mapping/dictionary instead of a list.
 */
export function combineLatestObjects<T>(streams: ItemsToObservableInput<T>): Observable<T> {
  const [keys, list] = splitKeyValues(streams);
  return combineLatest(...list)
    .pipe(
      map(values => zipObject(keys, values) as T),
    );
}


export type ObservablesWithInitialMapping<T> = {
  [K in keyof T]: ObservableWithInitial<T[K]>;
};
export interface ObservableWithInitial<T> {
  stream: ObservableInput<T>;
  initial: T;
}
export function combineLatestPreInitialized<T>(dict: ObservablesWithInitialMapping<T>): Observable<T> {
  const streams = mapEntries(dict, (k, item: any) =>
    from(item.stream).pipe(startWith(item.initial))) as {[K in keyof T]: Observable<T[K]>};
  return combineLatestObjects(streams)
    .pipe(
      // Skip starting value needed to get combine latest initialized
      skip(1),
    );
}
