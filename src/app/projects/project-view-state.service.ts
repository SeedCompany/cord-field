import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Language } from '../core/models/language';
import { Partnership, PartnershipForSaveAPI } from '../core/models/partnership';
import { Project } from '../core/models/project';
import { TeamMember, TeamMemberForSaveAPI } from '../core/models/team-member';
import { clone } from '../core/models/util';
import { ProjectService } from '../core/services/project.service';

const isEqual = require('lodash.isequal');

type Scalar = string | number | boolean;
type Accessor = (val: any) => Scalar;
type Comparator = (a: any, b: any) => boolean;

/**
 * Definition of how changes should be processed.
 */
type ChangeConfig = {
  [key in keyof Partial<Project>]: {
    accessor: Accessor,
    toServer?: (val: any) => any,
    key?: string, // The key the server is looking for
    forceRefresh?: boolean
  }
};

/**
 * Given mappers for add/remove/update items return a function for config.toServer.
 * This makes it easier to map the items differently for each change to their server values.
 * By default, `mapUpdate` uses the same function as `mapAdd`.
 *
 * For example:
 *   // When adding items give the server the full objects, but when removing only give the IDs.
 *   mapChangeList(item => item, item => item.id);
 */
function mapChangeList<T, A, R, C = A>(mapAdd: (item: T) => A, mapRemove: (item: T) => R, mapUpdate?: (item: T) => C) {
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

/**
 * Changes that can be processed with the change() method.
 */
type Changes = {[key in keyof Partial<Project>]: any | ChangeList<any>};

/**
 * One of the changes can be for field that is a list, which will use this structure.
 */
interface ChangeList<T> {
  add?: T;
  remove?: T;
  update?: T;
}

/**
 * For better key definition for Object.entries()
 */
type ChangeEntries = Array<[keyof Project, any]>;

/**
 * These are for the collective changes that will be processed on save().
 */
export type ModifiedProject = {[key in keyof Partial<Project>]: any | ModifiedList<any>};

/**
 * The collective changes for a list field.
 */
type ModifiedList<T> = Record<keyof ChangeList<T>, T[]>;

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

const returnSelf = (val: any) => val;
const returnId = (val: {id: string}) => val.id;

@Injectable()
export class ProjectViewStateService {

  private _project = new BehaviorSubject<Project>(Project.fromJson({}));

  private dirty = new BehaviorSubject<boolean>(false);
  private modified: ModifiedProject = {};

  private submitting = new BehaviorSubject<boolean>(false);
  private _loadError = new Subject<Error>();

  private config: ChangeConfig = {
    mouStart: {
      accessor: (date: Date) => date.getTime()
    },
    mouEnd: {
      accessor: (date: Date) => date.getTime()
    },
    location: {
      accessor: returnId,
      toServer: returnId,
      key: 'locationId',
      forceRefresh: true
    },
    languages: {
      accessor: returnId,
      toServer: mapChangeList<Language, string, string>(returnId, returnId)
    },
    partnerships: {
      accessor: returnId,
      toServer: mapChangeList<Partnership, PartnershipForSaveAPI, string>(Partnership.forSaveAPI, returnId)
    },
    team: {
      accessor: returnId,
      toServer: mapChangeList<TeamMember, TeamMemberForSaveAPI, string>(TeamMember.forSaveAPI, returnId)
    }
  };

  constructor(private projectService: ProjectService) {}

  get project(): Observable<Project> {
    return this._project.asObservable();
  }

  get isDirty(): Observable<boolean> {
    return this.dirty.asObservable().distinctUntilChanged();
  }

  get isSubmitting(): Observable<boolean> {
    return this.submitting.asObservable();
  }

  get loadError(): Observable<Error> {
    return this._loadError.asObservable();
  }

  onNewId(id: string): void {
    this.projectService.getProject(id)
      .subscribe(
        this.onNewProject.bind(this),
        (err: Error) => this._loadError.next(err)
      );
  }

  change(changes: Changes): void {
    const project = this._project.value;

    for (const [key, change] of Object.entries(changes) as ChangeEntries) {
      if (!(key in this.config)) {
        continue;
      }

      if (!isChangeForList(change)) {
        this.changeSingle(key, change, project[key]);
        continue;
      }
      if ('remove' in change) {
        this.removeList(key, change.remove, project[key] as any[] | null);
      }
      if ('add' in change) {
        this.addList(key, change.add, project[key] as any[] | null);
      }
      if ('update' in change) {
        this.updateListItem(key, change.update, project[key] as any[] | null);
      }
    }

    this.dirty.next(Object.keys(this.modified).length > 0);
  }

  private addList(key: keyof Project, newValue: any, originalValue: any[] | null): void {
    const finder = findBy(this.config[key].accessor)(newValue);
    // If item is not in add list...
    if (!(key in this.modified && 'add' in this.modified[key] && this.modified[key].add.some(finder))) {
      // And original list does not have item, add it
      if (originalValue == null || !originalValue.some(finder)) {
        const newList = [...(this.modified[key] ? (this.modified[key].add || []) : []), newValue];
        this.modified[key] = {...this.modified[key] || {}, add: newList};
      }
    }
    // If item is in remove list, remove it
    if (key in this.modified && 'remove' in this.modified[key] && this.modified[key].remove.some(finder)) {
      const excluder = excludeBy(this.config[key].accessor)(newValue);
      const newList = [...this.modified[key].remove.filter(excluder)];
      if (newList.length === 0) {
        delete this.modified[key].remove;
      } else {
        this.modified[key].remove = newList;
      }
    }

    if (key in this.modified && Object.keys(this.modified[key]).length === 0) {
      delete this.modified[key];
    }
  }

  private removeList(key: keyof Project, newValue: any, originalValue: any[] | null): void {
    const finder = findBy(this.config[key].accessor)(newValue);
    // If item is not in remove list...
    if (!(key in this.modified && 'remove' in this.modified[key] && this.modified[key].remove.some(finder))) {
      // And original list has item, remove it
      if (originalValue == null || originalValue.some(finder)) {
        const newList = [...(this.modified[key] ? (this.modified[key].remove || []) : []), newValue];
        this.modified = {...this.modified, [key]: {remove: newList}};
      }
    }
    // If item is in add list, remove it
    if (key in this.modified && 'add' in this.modified[key] && this.modified[key].add.some(finder)) {
      const excluder = excludeBy(this.config[key].accessor)(newValue);
      const newList = [...this.modified[key].add.filter(excluder)];
      if (newList.length === 0) {
        delete this.modified[key].add;
      } else {
        this.modified[key].add = newList;
      }
    }

    if (key in this.modified && Object.keys(this.modified[key]).length === 0) {
      delete this.modified[key];
    }
  }

  private updateListItem(key: keyof Project, newValue: any, originalList: any[] | null): void {
    const finder = findBy(this.config[key].accessor)(newValue);
    // If item is in add list...
    if (key in this.modified && 'add' in this.modified[key] && this.modified[key].add.some(finder)) {
      const index = this.modified[key].add.findIndex(finder);
      this.modified[key].add[index] = newValue;
      return;
    }
    // If item is not update list, add it
    if (!(key in this.modified && 'update' in this.modified[key] && this.modified[key].update.some(finder))) {
      const newChangeList = [...(this.modified[key] ? (this.modified[key].update || []) : []), newValue];
      this.modified[key] = {...this.modified[key] || {}, update: newChangeList};
      return;
    }
    // Get original value or fix dev mistake
    const originalValue = originalList ? originalList.find(finder) : null;
    if (!originalValue) {
      // item isn't in original list, it should be added instead of changed. We should warn dev on this.
      this.addList(key, newValue, originalList);
      return;
    }
    // If update is still different than original replace item in update list.
    if (!isEqual(newValue, originalValue)) {
      const index = this.modified[key].update.findIndex(finder);
      this.modified[key].update[index] = newValue;
      return;
    }

    // Remove from update list
    const excluder = excludeBy(this.config[key].accessor)(newValue);
    const newList = [...this.modified[key].update.filter(excluder)];
    if (newList.length === 0) {
      delete this.modified[key].update;
    } else {
      this.modified[key].update = newList;
    }

    if (Object.keys(this.modified[key]).length === 0) {
      delete this.modified[key];
    }
  }

  private changeSingle(key: keyof Project, newValue: any, originalValue: any): void {
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

  async save(): Promise<void> {
    const modified: any = {};
    for (const [key, change] of Object.entries(this.modified) as ChangeEntries) {
      modified[this.config[key].key || key] = this.config[key].toServer ? this.config[key].toServer!(change) : change;
    }
    this.submitting.next(true);
    try {
      await this.projectService.save(this._project.value.id, modified);
    } finally {
      this.submitting.next(false);
    }

    // Apply changes to a new project object, so we don't have to ask the server for a new version
    const project = clone(this._project.value);
    let needsRefresh = false;
    for (const [key, change] of Object.entries(this.modified) as ChangeEntries) {
      if (this.config[key].forceRefresh) {
        needsRefresh = true;
      }
      if (!isChangeForList(change)) {
        project[key] = change;
        continue;
      }
      if ('remove' in change) {
        const accessor = this.config[key].accessor;
        const toRemove = (change.remove as any[]).map(accessor);
        project[key] = (project[key] as any[]).filter(current => !toRemove.includes(accessor(current)));
      }
      if ('add' in change) {
        project[key] = (project[key] as any[]).concat(change.add);
      }
      if ('update' in change) {
        const comparator = compareBy(this.config[key].accessor);
        for (const item of change.update) {
          const index = (project[key] as any[]).findIndex(current => comparator(current, item));
          if (index !== -1) {
            (project[key] as any[])[index] = item;
          }
        }
      }
    }

    this.onNewProject(project);

    if (needsRefresh) {
      this.onNewId(project.id);
    }
  }

  discard(): void {
    this.onNewProject(this._project.value);
  }

  private onNewProject(project: Project): void {
    this.modified = {};
    this._project.next(project);
    this.dirty.next(false);
  }
}
