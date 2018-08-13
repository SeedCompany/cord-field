import { isEqual } from 'lodash-es';
import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SaveResult } from './abstract-view-state';
import { clone, mapEntries } from './util';

type Scalar = string | number | boolean;
type Accessor = (val: any) => Scalar;
type Comparator = (a: any, b: any) => boolean;

/**
 * Definition of how changes should be processed.
 */
export type ChangeConfig<T = any> = {
  [key in keyof Partial<T>]: Partial<FieldConfig>;
};

type ResolvedConfig<T = any> = {
  [key in keyof Partial<T>]: FieldConfig;
};

interface FieldConfig {
  accessor: Accessor;
  toServer: (val: any) => any;
  key: string; // The key the server is looking for
  forceRefresh: boolean;
}

/**
 * Given mappers for add/remove/update items return a function for config.toServer.
 * This makes it easier to map the items differently for each change to their server values.
 * By default, `mapUpdate` uses the same function as `mapAdd`.
 *
 * For example:
 *   // When adding items give the server the full objects, but when removing only give the IDs.
 *   mapChangeList(item => item, item => item.id);
 */
export function mapChangeList<T, A, R, C = A>(mapAdd: (item: T) => A, mapRemove: (item: T) => R, mapUpdate?: (item: T) => C) {
  return (changes: ModifiedList<T>) => {
    const result: {add?: A[], remove?: R[], update?: C[]} = {};

    if ('add' in changes && changes.add) {
      result.add = changes.add.map(mapAdd);
    }
    if ('remove' in changes && changes.remove) {
      result.remove = changes.remove.map(mapRemove);
    }
    if ('update' in changes && changes.update) {
      result.update = changes.update.map(mapUpdate || mapAdd as any as (item: T) => C);
    }

    return result;
  };
}

export const returnSelf = (val: any) => val;
export const returnId = (val: {id: string}) => val.id;
// Ignores times
export const accessDates = (date: DateTime) => date.startOf('day').valueOf();

/**
 * These are for the collective changes that will be processed on save().
 */
export type Modified<T = any> = {[key in keyof Partial<T>]: any | ModifiedList<any>};

/**
 * Changes that can be processed with the change() method.
 */
export type Changes<T = any> = {[key in keyof Partial<T>]: any | ChangeList<any>};

/**
 * The collective changes for a list field.
 */
type ModifiedList<T = any> = Record<keyof ChangeList<T>, T[]>;

/**
 * One of the changes can be for field that is a list, which will use this structure.
 */
interface ChangeList<T = any> {
  add?: T;
  remove?: T;
  update?: T;
}

/**
 * Compare objects by mapping them to comparable values with the given accessor.
 */
const compareBy = (accessor: Accessor): Comparator => {
  return (a, b) => {
    return accessor(a) === accessor(b);
  };
};

/**
 * Wrap comparator to check for nulls first
 */
const compareNullable = (compare: Comparator): Comparator => {
  return (a, b) => {
    // double equals here is intentional to account for undefined
    if (a == null && b == null) {
      return true;
    }
    if ((a != null && b == null) || (a == null && b != null)) {
      return false;
    }
    return compare(a, b);
  };
};

const findBy = (accessor: Accessor) => {
  const comparator = compareBy(accessor);
  return (value: any) => (current: any) => comparator(current, value);
};
const excludeBy = (accessor: Accessor) => {
  const comparator = compareBy(accessor);
  return (value: any) => (current: any) => !comparator(current, value);
};

const isChangeForList = (change: any): boolean => {
  return change != null && typeof change === 'object' && ('add' in change || 'remove' in change || 'update' in change);
};

export class ChangeEngine<T = any> {

  private readonly config: ResolvedConfig<T>;
  private readonly dirty = new BehaviorSubject<boolean>(false);
  private modified = {} as Modified<T>;

  constructor(config: ChangeConfig<T>) {
    this.config = mapEntries(config, (key: keyof T, field: Partial<FieldConfig>) => ({
      accessor: returnSelf,
      key: key as string,
      toServer: returnSelf,
      forceRefresh: false,
      ...field
    }));
  }

  get isDirty(): Observable<boolean> {
    return this.dirty.asObservable().distinctUntilChanged();
  }

  get needsRefresh(): boolean {
    for (const key of Object.keys(this.modified) as Array<keyof T>) {
      if (this.config[key].forceRefresh) {
        return true;
      }
    }

    return false;
  }

  getModifiedForServer<R>(): R {
    const modified: any = {};
    for (const [key, change] of Object.entries(this.modified) as Array<[keyof T, any]>) {
      modified[this.config[key].key] = this.config[key].toServer(change);
    }

    return modified;
  }

  getModified(original: T, newIds?: SaveResult<T>): T {
    const obj = clone(original);

    for (const [key, change] of Object.entries(this.modified) as Array<[keyof T, any]>) {
      if (!isChangeForList(change)) {
        obj[key] = change;
        continue;
      }
      if ('remove' in change) {
        const accessor = this.config[key].accessor;
        const toRemove = (change.remove as any[]).map(accessor);
        obj[key] = (obj[key] as any as any[]).filter(current => !toRemove.includes(accessor(current))) as any;
      }
      if ('add' in change) {
        if (newIds && key in newIds) {
          for (let i = 0; i < change.add.length; i++) {
            change.add[i].id = newIds[key][i];
          }
        }

        obj[key] = (obj[key] as any as any[]).concat(change.add) as any;
      }
      if ('update' in change) {
        const comparator = compareBy(this.config[key].accessor);
        for (const item of change.update) {
          const index = (obj[key] as any as any[]).findIndex(current => comparator(current, item));
          if (index !== -1) {
            (obj[key] as any as any[])[index] = item;
          }
        }
      }
    }

    return obj as T;
  }

  reset() {
    this.modified = {} as Modified<T>;
    this.dirty.next(false);
  }

  change(changes: Changes<T>, original: T): void {
    for (const [key, change] of Object.entries(changes) as Array<[keyof T, any]>) {
      if (!(key in this.config)) {
        continue;
      }

      if (!isChangeForList(change)) {
        this.changeSingle(key, change, original[key]);
        continue;
      }
      if ('remove' in change) {
        this.removeList(key, change.remove, original[key] as any);
      }
      if ('add' in change) {
        this.addList(key, change.add, original[key] as any);
      }
      if ('update' in change) {
        this.updateListItem(key, change.update, original[key] as any);
      }
    }

    this.dirty.next(Object.keys(this.modified).length > 0);
  }

  private addList<I>(key: keyof T, newValue: I, originalValue: I[] | null): void {
    const finder = findBy(this.config[key].accessor)(newValue);
    // If item is not in add list...
    if (!this.isItemInSubList('add', key, finder)) {
      // And original list does not have item, add it
      if (originalValue == null || !originalValue.some(finder)) {
        this.addItemToSubList('add', key, newValue);
      }
    }
    // If item is in remove list, remove it
    this.removeItemFromSubList('remove', key, newValue, finder);

    this.removeChangeListIfEmpty(key);
  }

  private removeList<I>(key: keyof T, newValue: I, originalValue: I[] | null): void {
    const finder = findBy(this.config[key].accessor)(newValue);
    // If item is not in remove list...
    if (!this.isItemInSubList('remove', key, finder)) {
      // And original list has item, remove it
      if (originalValue == null || originalValue.some(finder)) {
        this.addItemToSubList('remove', key, newValue);
      }
    }
    // If item is in add list, remove it
    this.removeItemFromSubList('add', key, newValue, finder);

    this.removeChangeListIfEmpty(key);
  }

  private updateListItem<I>(key: keyof T, newValue: I, originalList: I[] | null): void {
    const finder = findBy(this.config[key].accessor)(newValue);
    // If item is in add list...
    if (this.isItemInSubList('add', key, finder)) {
      this.replaceItemInSubList('add', key, newValue, finder);
      return;
    }

    // Get original value or fix dev mistake
    const originalValue = originalList ? originalList.find(finder) : null;
    if (!originalValue) {
      // item isn't in original list, it should be added instead of changed. We should warn dev on this.
      this.addList(key, newValue, originalList);
      return;
    }

    // If item is in remove list, remove it
    this.removeItemFromSubList('remove', key, newValue, finder);

    // If update is different than original...
    if (!isEqual(newValue, originalValue)) {
      // And the item is not update list, add it
      if (!this.isItemInSubList('update', key, finder)) {
        this.addItemToSubList('update', key, newValue);
      } else { // And item is in the update list, replace item in update list
        this.replaceItemInSubList('update', key, newValue, finder);
      }

      return;
    }

    // New value matches original, remove from update list
    this.removeItemFromSubList('update', key, newValue, finder);

    this.removeChangeListIfEmpty(key);
  }

  private addItemToSubList<I>(changeListKey: keyof ChangeList<I>, key: keyof T, newValue: I) {
    const newList = [...(this.modified[key] ? (this.modified[key][changeListKey] || []) : []), newValue];
    // @ts-ignore
    this.modified[key] = {...this.modified[key] || {}, [changeListKey]: newList};
  }

  private replaceItemInSubList<I>(changeListKey: keyof ChangeList<I>, key: keyof T, newValue: I, finder: (val: I) => boolean) {
    const list = this.modified[key][changeListKey];
    const index = list.findIndex(finder);
    list[index] = newValue;
  }

  /**
   * If item is in add/remove/update list, remove it
   */
  private removeItemFromSubList<I>(changeListKey: keyof ChangeList<I>, key: keyof T, newValue: I, finder: (val: I) => boolean) {
    if (!this.isItemInSubList(changeListKey, key, finder)) {
      return;
    }

    const excluder = excludeBy(this.config[key].accessor)(newValue);
    const newList = [...this.modified[key][changeListKey].filter(excluder)];
    if (newList.length === 0) {
      delete this.modified[key][changeListKey];
    } else {
      this.modified[key]![changeListKey] = newList;
    }
  }

  private isItemInSubList<I>(changeListKey: keyof ChangeList<I>, key: keyof T, finder: (val: I) => boolean): boolean {
    return key in this.modified
      && changeListKey in this.modified[key]
      && this.modified[key][changeListKey].some(finder);
  }

  private removeChangeListIfEmpty(key: keyof T) {
    if (key in this.modified && Object.keys(this.modified[key]).length === 0) {
      delete this.modified[key];
    }
  }

  private changeSingle<I>(key: keyof T, newValue: I, originalValue: I): void {
    const comparator = compareNullable(compareBy(this.config[key].accessor));

    if (key in this.modified && comparator(this.modified[key], newValue)) {
      return;
    }

    if (!comparator(originalValue, newValue)) {
      this.modified[key] = newValue;
    } else {
      delete this.modified[key];
    }
  }
}
