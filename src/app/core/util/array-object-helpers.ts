import { OneOrMore } from '@app/core/util/types';

export function clone<T>(obj: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

/**
 * A helper to filter objects by their key/values via a predicate function
 *
 *   filterEntries(obj, (key, value) => value.keep == true);
 */
export function filterEntries<T>(obj: T, predicate: (key: keyof T, value: T[keyof T]) => boolean): T {
  const filtered: any = {};

  for (const [key, value] of Object.entries(obj) as [keyof T, any]) {
    if (predicate(key, value)) {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * A helper to filter objects by their values via a predicate function
 *
 *   filterValues(obj, (value) => value.keep == true);
 */
export function filterValues<T>(obj: T, predicate: (value: T[keyof T]) => boolean): T {
  const filtered: any = {};

  for (const [key, value] of Object.entries(obj) as [keyof T, any]) {
    if (predicate(value)) {
      filtered[key] = value;
    }
  }

  return filtered;
}

// Shortcut for a mapping of keys of object {T} to values {V}
export type ObjMap<T, V> = {[key in keyof Partial<T>]: V};

/**
 * A helper to map object values by their key/values via a mapper function
 *
 * mapEntries(obj, (key, value) => value + 1)
 */
export function mapEntries<T extends ObjMap<T, V>, V, U>(obj: T, mapper: (key: keyof T, value: V) => U): ObjMap<T, U> {
  const mapped = {} as ObjMap<T, U>;

  for (const [key, value] of Object.entries(obj) as Array<[keyof T, V]>) {
    mapped[key] = mapper(key, value);
  }

  return mapped;
}

export const maybeArray = <T>(items: OneOrMore<T>): T[] =>
  Array.isArray(items) ? items : [items];

export function sortBy<T>(iteratee: (item: T) => any, order: 'asc' | 'desc' = 'asc') {
  return (a: T, b: T) => {
    const sortA = iteratee(a);
    const sortB = iteratee(b);

    if (sortA < sortB) {
      return order === 'asc' ? -1 : 1;
    }
    if (sortA > sortB) {
      return order === 'asc' ? 1 : -1;
    }

    return 0;
  };
}

/**
 * Takes the object and returns a list of keys and a list of values.
 * The order of both lists correlate and can be re-associated with their respective indexes.
 */
export function splitKeyValues<T>(object: T): [Array<keyof T>, Array<T[keyof T]>] {
  const keys: Array<keyof T> = [];
  const values = [];
  for (const [key, value] of Object.entries(object)) {
    keys.push(key as keyof T);
    values.push(value);
  }
  return [keys, values];
}
