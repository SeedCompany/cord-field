import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Language } from '../core/models/language';
import { Location } from '../core/models/location';
import { Partnership } from '../core/models/partnership';
import { Project } from '../core/models/project';
import { ProjectService } from '../core/services/project.service';

type Scalar = string | number | boolean;
type Accessor = (val: any) => Scalar;
type Comparator = (a: any, b: any) => boolean;

/**
 * Definition of how changes should be processed.
 */
type ChangeConfig = {
  [key in keyof Partial<Project>]: {
    accessor: Accessor,
    toServer?: (val: any) => any
  }
};

/**
 * Given mappers for add items and remove items return a function for config.toServer.
 * This makes it easier to map the items (differently for adding and removing) to their server values.
 *
 * For example:
 *   // When adding items give the server the full objects, but when removing only give the IDs.
 *   mapChangeList(item => item, item => item.id);
 *
 * @param {(item: T) => A} mapAdd
 * @param {(item: T) => R} mapRemove
 * @returns {(changes: ModifiedList<T>) => {add?: A[]; remove?: R[]}}
 */
const mapChangeList = <T, A, R>(mapAdd: (item: T) => A, mapRemove: (item: T) => R) => {
  return (changes: ModifiedList<T>) => {
    const result: {add?: A[], remove?: R[]} = {};

    if ('add' in changes && changes.add) {
      result.add = changes.add.map(mapAdd);
    }
    if ('remove' in changes && changes.remove) {
      result.remove = changes.remove.map(mapRemove);
    }

    return result;
  };
};

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
interface ModifiedList<T> {
  add?: T[];
  remove?: T[];
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

const isChangeForList = (change: any): boolean => {
  return change != null && typeof change === 'object' && ('add' in change || 'remove' in change);
};

@Injectable()
export class ProjectViewStateService {

  private _project = new BehaviorSubject<Project>(Project.fromJson({}));

  private dirty = new BehaviorSubject<boolean>(false);
  private modified: ModifiedProject;

  private submitting = new BehaviorSubject<boolean>(false);

  private config: ChangeConfig = {
    startDate: {
      accessor: (date: Date) => date.getTime()
    },
    endDate: {
      accessor: (date: Date) => date.getTime()
    },
    location: {
      accessor: (location: Location) => location.id,
      toServer: (location: Location) => location.id
    },
    languages: {
      accessor: (language: Language) => language.id,
      toServer: mapChangeList<Language, string, string>(language => language.id, language => language.id)
    },
    partnerships: {
      accessor: (partnership: Partnership) => partnership.id,
      toServer: mapChangeList<Partnership, Partnership, string>(partnership => partnership, partnership => partnership.id)
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

  onNewId(id: string): void {
    this.projectService.getProject(id).subscribe(this.onNewProject.bind(this));
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
    }

    this.dirty.next(Object.keys(this.modified).length > 0);
  }

  private addList(key: keyof Project, newValue: any, originalValue: any[] | null): void {
    const comparator = compareBy(this.config[key].accessor);
    const matchChanged = (current: any) => comparator(current, newValue);
    // If item is not in add list...
    if (!(key in this.modified && 'add' in this.modified[key] && this.modified[key].add.some(matchChanged))) {
      // And original list does not have item, add it
      if (originalValue == null || !originalValue.some(matchChanged)) {
        const newList = [...(this.modified[key] ? (this.modified[key].add || []) : []), newValue];
        this.modified[key] = {...this.modified[key] || {}, add: newList};
      }
    }
    // If item is in remove list, remove it
    if (key in this.modified && 'remove' in this.modified[key] && this.modified[key].remove.some(matchChanged)) {
      const newList = [...this.modified[key].remove.filter((current: any) => !comparator(current, newValue))];
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
    const comparator = compareBy(this.config[key].accessor);
    const matchChanged = (current: any) => comparator(current, newValue);
    // If item is not in remove list...
    if (!(key in this.modified && 'remove' in this.modified[key] && this.modified[key].remove.some(matchChanged))) {
      // And original list has item, remove it
      if (originalValue == null || originalValue.some(matchChanged)) {
        const newList = [...(this.modified[key] ? (this.modified[key].remove || []) : []), newValue];
        this.modified = {...this.modified, [key]: {remove: newList}};
      }
    }
    // If item is in add list, remove it
    if (key in this.modified && 'add' in this.modified[key] && this.modified[key].add.some(matchChanged)) {
      const newList = [...this.modified[key].add.filter((current: any) => !comparator(current, newValue))];
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
    const modified: ModifiedProject = {};
    for (const [key, change] of Object.entries(this.modified) as ChangeEntries) {
      modified[key] = this.config[key].toServer ? this.config[key].toServer!(change) : change;
    }
    this.submitting.next(true);
    try {
      await this.projectService.save(this._project.value.id, modified);
    } finally {
      this.submitting.next(false);
    }

    // Apply changes to a new project object, so we don't have to ask the server for a new version
    const previous = this._project.value;
    // clone project
    const project: Project = Object.assign(Object.create(Object.getPrototypeOf(previous)), previous);
    for (const [key, change] of Object.entries(this.modified) as ChangeEntries) {
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
    }

    this.onNewProject(project);
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
