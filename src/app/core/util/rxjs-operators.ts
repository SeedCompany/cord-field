import { FormGroup } from '@angular/forms';
import { EMPTY, from, Observable, of } from 'rxjs';
import { isInteropObservable } from 'rxjs/internal/util/isInteropObservable';
import { filter, map } from 'rxjs/operators';
import { filterEntries } from './array-object-helpers';

export type MaybeObservable<T> = Observable<T> | T;

export const maybeObservable = <T>(obs?: MaybeObservable<T>): Observable<T> =>
  obs == null ? EMPTY :
    isInteropObservable(obs) ? from(obs) : of(obs);

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
