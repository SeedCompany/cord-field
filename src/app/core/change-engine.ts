import { BaseStorageService } from '@app/core/services/storage.service';
import { differenceBy, isEqual } from 'lodash-es';
import { DateTime } from 'luxon';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SaveResult } from './abstract-view-state';
import { ArrayItem, clone, ExtractKeys, mapEntries, OmitWithType } from './util';

type Scalar = string | number | boolean;
type Accessor = (val: any) => Scalar;
type Comparator = (a: any, b: any) => boolean;

/**
 * Definition of how changes should be processed.
 */
export type ChangeConfig<Model = any> = {
  [Field in keyof Partial<Model>]: FieldConfig<Model[Field]>;
};

export interface FieldConfig<T = unknown, ServerVal = unknown, Stored = any> {
  accessor?: Accessor;
  toServer?: (val: ModifiedItem<T>, original: T) => ServerVal;
  key?: string; // The key the server is looking for
  forceRefresh?: boolean;
  store?: (val: ModifiedItem<T>) => Stored;
  restore?: (val: Stored) => ModifiedItem<T>;
}

type ResolvedConfig<Model = any> = {
  [Field in keyof Partial<Model>]: ResolvedFieldConfig<Model[Field]>;
};

type ResolvedFieldConfig<T = unknown, ServerVal = unknown, Stored = any> = Required<FieldConfig<T, ServerVal, Stored>>;

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
  return (changes: ModifiedList<T>): ModifiedList<A, R, C> => {
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
export const returnIdOrNull = (val: {id: string} | null) => val ? val.id : null;
// Ignores times
export const accessDates = (date: DateTime) => date.startOf('day').valueOf();

export const storeDate = (date: DateTime | null) => date ? date.toISO() : null;
export const restoreDate = (date: string | null) => date ? DateTime.fromISO(date) : null;
export const dateConfig: Partial<FieldConfig<DateTime | null>> = {
  accessor: accessDates,
  toServer: dt => dt ? dt.toISODate() : null,
  store: storeDate,
  restore: restoreDate,
};

/**
 * These are for the collective changes that will be processed on save().
 */
export type ModifiedModel<T = any> = { [K in keyof Partial<T>]: ModifiedItem<T[K]> };

export type ModifiedItem<T> = T extends Array<infer U> ? ModifiedList<U> : T;

/**
 * Changes that can be processed with the change() method.
 */
export type Changes<T = any> = { [K in keyof Partial<T>]: ChangeItem<T[K]> };

export type ChangeItem<T> = T extends Array<infer U> ? ChangeList<U> : T;

/**
 * The collective changes for a list field.
 */
export interface ModifiedList<A = any, R = A, U = A> {
  add?: A[];
  remove?: R[];
  update?: U[];
}

/**
 * One of the changes can be for field that is a list, which will use this structure.
 */
export interface ChangeList<A = any, R = A, U = A> {
  add?: A;
  remove?: R;
  update?: U;
}
type ChangeListKey = keyof ChangeList<any>;

/**
 * Compare objects by mapping them to comparable values with the given accessor.
 */
const compareBy = (accessor: Accessor): Comparator => {
  return (a, b) => {
    return accessor(a) === accessor(b);
  };
};

const compareListsBy = (accessor: Accessor): Comparator => {
  return (a, b) =>
    differenceBy(a, b, accessor).length === 0 &&
    differenceBy(b, a, accessor).length === 0;
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

export type ListKey<T> = ExtractKeys<T, any[]>;
export type SingleKey<T> = keyof OmitWithType<T, any[]>;
const isChangeForList = <T>(change: any, key: keyof T): key is ListKey<T> => {
  return change != null && typeof change === 'object' && ('add' in change || 'remove' in change || 'update' in change);
};

/**
 * With an accessor, merge the list modifications (sum of changes) to the original list and return the new list.
 */
export const modifiedListMerger = <T>(accessor: Accessor = returnSelf) => (change: ModifiedList<T>, original: T[]) => {
  // clone list so changes don't affect original
  let list = original.slice();

  if ('remove' in change) {
    const toRemove = change.remove!.map(accessor);
    list = list.filter(current => !toRemove.includes(accessor(current)));
  }

  if ('add' in change) {
    list = list.concat(change.add!);
  }

  if ('update' in change) {
    const comparator = compareBy(accessor);
    for (const item of change.update!) {
      const index = list.findIndex(current => comparator(current, item));
      if (index !== -1) {
        list[index] = item;
      }
    }
  }

  return list;
};

export class ChangeEngine<T = any, ModifiedForServer = any> {

  public readonly config: ResolvedConfig<T>;
  private readonly dirty = new BehaviorSubject<boolean>(false);
  private modified = {} as ModifiedModel<T>;

  constructor(config: ChangeConfig<T>) {
    this.config = mapEntries(config, (key: keyof T, field: FieldConfig<any>) => ({
      accessor: returnSelf,
      key: key as string,
      toServer: returnSelf,
      forceRefresh: false,
      store: returnSelf,
      restore: returnSelf,
      ...field,
    }));
  }

  get isDirty(): Observable<boolean> {
    return this.dirty.asObservable().pipe(distinctUntilChanged());
  }

  get needsRefresh(): boolean {
    for (const key of Object.keys(this.modified) as Array<keyof T>) {
      if (this.config[key].forceRefresh) {
        return true;
      }
    }

    return false;
  }

  getModifiedForServer(original: T): ModifiedForServer {
    const modified: any = {};
    for (const [key, change] of Object.entries(this.modified) as Array<[keyof T, any]>) {
      modified[this.config[key].key] = this.config[key].toServer(change, original[key]);
    }

    return modified;
  }

  getModified(original: T, newIds?: SaveResult<T>): T {
    const obj = clone(original);

    for (const [key, change] of Object.entries(this.modified) as Array<[keyof T, any]>) {
      if (!isChangeForList(change, key)) {
        obj[key] = change;
        continue;
      }

      if ('add' in change && newIds && key in newIds) {
        for (let i = 0; i < change.add.length; i++) {
          change.add[i].id = newIds[key][i];
        }
      }

      obj[key] = modifiedListMerger(this.config[key].accessor)(change, obj[key] as any) as any;
    }

    return obj as T;
  }

  reset() {
    this.modified = {} as ModifiedModel<T>;
    this.dirty.next(false);
  }

  async restoreModifications(storage: BaseStorageService<any>, storageKey: string) {
    const serialized = await storage.getItem<Record<keyof T, any>>('changes-' + storageKey);
    if (!serialized) {
      return;
    }

    this.modified = mapEntries(serialized, (key, value) => this.config[key].restore(value)) as ModifiedModel<T>;
    this.dirty.next(Object.keys(this.modified).length > 0);
  }

  async storeModifications(storage: BaseStorageService<any>, storageKey: string) {
    if (!this.dirty.value) {
      return;
    }
    const serialized = mapEntries(this.modified, (key: keyof T, value: ModifiedItem<T[keyof T]>) => this.config[key].store(value));
    await storage.setItem('changes-' + storageKey, serialized);
  }

  async clearModifications(storage: BaseStorageService<any>, storageKey: string) {
    await storage.removeItem('changes-' + storageKey);
  }

  revert<K extends keyof T>(field: K, item?: ArrayItem<T[K]>): void {
    this.ensureFieldConfigured(field);
    if (item) {
      const listField = field as unknown as ListKey<T>;
      const listItem = item as unknown as ArrayItem<T[ListKey<T>]>;
      const finder = findBy(this.config[field].accessor)(item);
      this.removeItemFromSubList('add', listField, listItem, finder);
      this.removeItemFromSubList('remove', listField, listItem, finder);
      this.removeItemFromSubList('update', listField, listItem, finder);
      this.removeChangeListIfEmpty(listField);
    } else {
      delete this.modified[field];
    }

    this.dirty.next(Object.keys(this.modified).length > 0);
  }

  change(changes: Changes<T>, original: T): void {
    for (const [key, change] of Object.entries(changes) as Array<[keyof T, any]>) {
      this.ensureFieldConfigured(key);

      if (isChangeForList(change, key)) {
        this.changeList(key, change, original[key] as any);
      } else {
        this.changeSingle(key as SingleKey<T>, change, original[key] as any);
      }
    }

    this.dirty.next(Object.keys(this.modified).length > 0);
  }

  private changeList<K extends ListKey<T>>(key: K, change: ChangeItem<any[]>, originalValue: any[]): void {
    if ('remove' in change) {
      this.removeList(key, change.remove, originalValue);
    }
    if ('add' in change) {
      this.addList(key, change.add!, originalValue);
    }
    if ('update' in change) {
      this.updateListItem(key, change.update!, originalValue);
    }
  }

  private addList<K extends ListKey<T>, I extends ArrayItem<T[K]>>(key: K, newValue: I, originalValue: I[] | null): void {
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

  private removeList<K extends ListKey<T>, I extends ArrayItem<T[K]>>(key: K, newValue: I, originalValue: I[] | null): void {
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

  private updateListItem<K extends ListKey<T>, I extends ArrayItem<T[K]>>(key: K, newValue: I, originalList: I[] | null): void {
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

  private addItemToSubList<K extends ListKey<T>, I extends ArrayItem<T[K]>>(changeListKey: ChangeListKey, key: ListKey<T>, newValue: I) {
    const oldList = this.modified[key] ? ((this.modified[key] as ModifiedList<I>)[changeListKey] || []) : [];
    const newList = [...oldList, newValue];
    this.modified[key] = {...this.modified[key] || {}, [changeListKey]: newList} as ModifiedItem<T[K]>;
  }

  private replaceItemInSubList<K extends ListKey<T>, I extends ArrayItem<T[K]>>(
    changeListKey: ChangeListKey,
    key: K,
    newValue: I,
    finder: (val: I) => boolean,
  ) {
    const list = (this.modified[key] as ModifiedList<I>)[changeListKey]!;
    const index = list.findIndex(finder);
    list[index] = newValue;
  }

  /**
   * If item is in add/remove/update list, remove it
   */
  private removeItemFromSubList<K extends ListKey<T>, I extends ArrayItem<T[K]>>(
    changeListKey: ChangeListKey,
    key: K,
    newValue: I,
    finder: (val: I) => boolean,
    ) {
    if (!this.isItemInSubList(changeListKey, key, finder)) {
      return;
    }

    const excluder = excludeBy(this.config[key].accessor)(newValue);
    const newList = [...(this.modified[key] as ModifiedList<I>)[changeListKey]!.filter(excluder)];
    if (newList.length === 0) {
      delete (this.modified[key] as ModifiedList<I>)[changeListKey];
    } else {
      (this.modified[key] as ModifiedList<I>)[changeListKey] = newList;
    }
  }

  private isItemInSubList<K extends ListKey<T>, I extends ArrayItem<T[K]>>(
    changeListKey: ChangeListKey,
    key: K,
    finder: (val: I) => boolean,
  ): boolean {
    return key in this.modified
      && changeListKey in this.modified[key]
      && (this.modified[key] as ModifiedList<I>)[changeListKey]!.some(finder);
  }

  private removeChangeListIfEmpty<K extends ListKey<T>>(key: K) {
    if (key in this.modified && Object.keys(this.modified[key]).length === 0) {
      delete this.modified[key];
    }
  }

  private changeSingle<K extends SingleKey<T>>(key: K, newValue: ModifiedItem<T[K]>, originalValue: T[K]): void {
    const accessor = this.config[key].accessor;
    const comparator = compareNullable((Array.isArray(newValue) ? compareListsBy : compareBy)(accessor));

    if (key in this.modified && comparator(this.modified[key], newValue)) {
      return;
    }

    if (!comparator(originalValue, newValue)) {
      this.modified[key] = newValue;
    } else {
      delete this.modified[key];
    }
  }

  private ensureFieldConfigured(key: keyof T) {
    if (!(key in this.config)) {
      throw new Error(key.toString());
    }
  }
}
