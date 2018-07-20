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

// Shortcut for a mapping of keys of object {T} to values {V}
export type ObjMap<T, V> = {[key in keyof T]: V};

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
