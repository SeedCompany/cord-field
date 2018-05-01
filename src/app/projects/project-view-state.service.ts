import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Language } from '../core/models/language';
import { Location } from '../core/models/location';
import { Project } from '../core/models/project';
import { ProjectService } from '../core/services/project.service';

type Scalar = string | number | boolean;
type Accessor = (val: any) => Scalar;
type Comparator = (a: any, b: any) => boolean;

/**
 * Definition of how changes should be processed.
 */
type ChangeConfig = {[key in keyof Partial<Project>]: Accessor};

/**
 * Changes that can be processed with the change() method.
 */
type Changes = {[key in keyof Partial<Project>]: any};

/**
 * For better key definition for Object.entries()
 */
type ChangeEntries = Array<[keyof Project, any]>;

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

@Injectable()
export class ProjectViewStateService {

  private _project = new BehaviorSubject<Project>(Project.fromJson({}));

  private dirty = new BehaviorSubject<boolean>(false);
  private modified: Changes;

  private config: ChangeConfig = {
    startDate: (date: Date) => date.getTime(),
    endDate: (date: Date) => date.getTime(),
    location: (location: Location) => location.id,
    languages: (language: Language) => language.id
  };

  constructor(private projectService: ProjectService) {}

  get project(): Observable<Project> {
    return this._project.asObservable();
  }

  get isDirty(): Observable<boolean> {
    return this.dirty.asObservable().distinctUntilChanged();
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
      const comparator = compareNullable(compareBy(this.config[key]));
      if (!(key in this.modified) || !comparator(this.modified[key], change)) {
        if (!comparator(project[key], change)) {
          this.modified[key] = change;
        } else {
          delete this.modified[key];
        }
      }
    }

    this.dirty.next(Object.keys(this.modified).length > 0);
  }

  save(): void {
    const previous = this._project.value;
    // clone project
    const project: Project = Object.assign(Object.create(Object.getPrototypeOf(previous)), previous);

    for (const [key, change] of Object.entries(this.modified) as ChangeEntries) {
      project[key] = change;
    }

    // TODO Call API

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
