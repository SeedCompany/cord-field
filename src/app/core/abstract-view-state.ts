import { AbstractControl, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable, PartialObserver, Subject, Unsubscribable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeConfig, ChangeEngine, Changes } from './change-engine';

export type SaveResult<T> = {[key in keyof Partial<T>]: string[]};

export abstract class AbstractViewState<T> {

  private readonly changeEngine: ChangeEngine<T>;
  private readonly _subject: BehaviorSubject<T>;
  private readonly _subjectWithChanges: BehaviorSubject<T>;
  private readonly submitting = new BehaviorSubject<boolean>(false);
  private readonly _loadError = new Subject<Error>();

  protected constructor(config: ChangeConfig<T>, initial: T) {
    this.changeEngine = new ChangeEngine(config);
    this._subject = new BehaviorSubject<T>(initial);
    this._subjectWithChanges = new BehaviorSubject<T>(initial);
  }

  /**
   * Called when saving the model's changes.
   * @param {T} subject The current subject (no changes applied)
   * @param changes The changes to give to the server (based on config)
   * @return lists of new IDs mapped to their keys
   */
  protected abstract onSave(subject: T, changes: any): Promise<SaveResult<T>>;

  /**
   * Called when the model needs to be refreshed from the server.
   * The method should call this.onLoad at some point.
   */
  protected abstract refresh(subject: T): void;

  get subject(): Observable<T> {
    return this._subject.asObservable();
  }

  get subjectWithChanges(): Observable<T> {
    return this._subjectWithChanges.asObservable();
  }

  get isDirty(): Observable<boolean> {
    return this.changeEngine.isDirty;
  }

  get isSubmitting(): Observable<boolean> {
    return this.submitting.asObservable();
  }

  get loadError(): Observable<Error> {
    return this._loadError.asObservable();
  }

  change(changes: Changes<T>): void {
    this.changeEngine.change(changes, this._subject.value);
    const next = this.changeEngine.getModified(this._subject.value);
    this._subjectWithChanges.next(next);
  }

  revert(field: keyof T, item?: any): void {
    this.changeEngine.revert(field, item);
  }

  async save(): Promise<void> {
    this.submitting.next(true);

    let result;
    try {
      const modified = this.changeEngine.getModifiedForServer();
      result = await this.onSave(this._subject.value, modified);
    } finally {
      this.submitting.next(false);
    }

    const next = this.changeEngine.getModified(this._subject.value, result);
    const needsRefresh = this.changeEngine.needsRefresh;

    this.onNewSubject(next);

    if (needsRefresh) {
      this.refresh(next);
    }
  }

  discard(): void {
    this.onNewSubject(this._subject.value);
  }

  /**
   * Create a form array for the given field. This syncs user input and subject changes to the form array
   * and gives back the control and functions to add & remove items from the array.
   */
  createFormArray(field: keyof T, createControl: (item?: any) => AbstractControl, unsubscribe: Observable<void>) {
    const form = new FormArray([]);

    // Subscriptions to individual item changes
    const subs: Unsubscribable[] = [];

    const add = (item?: any): void => {
      const control = createControl(item);

      const changesSub = control.valueChanges
        .pipe(takeUntil(unsubscribe))
        .subscribe(() => {
          if (control.valid) {
            this.change({[field]: {update: control.value}} as any);
          } else {
            this.revert(field, control.value);
          }
        });

      form.push(control);
      subs.push(changesSub);
    };

    const remove = (index: number, updateState = true): void => {
      const fg = form.at(index);
      form.removeAt(index);
      if (subs[index]) {
        subs[index].unsubscribe();
      }
      if (updateState) {
        this.change({[field]: {remove: fg.value}} as any);
      }
    };

    this.subject
      .pipe(takeUntil(unsubscribe))
      .subscribe(subject => {
        this.setupFormArrayItems(form, field, subject[field] as any, add, remove);
      });

    return {
      control: form,
      add,
      remove
    };
  }

  /**
   * This removes existing controls that don't have a model item anymore and adds new controls for new model items.
   */
  private setupFormArrayItems(
    form: FormArray,
    field: keyof T,
    value: any[],
    onAdd: (value: any) => void,
    onRemove: (index: number, updateState?: boolean) => void
  ): void {
    const accessor = this.changeEngine.config[field].accessor;

    const newIds = value.map(accessor);
    const currentIds = [];

    // Remove old items in reverse order because FormArray re-indexes on removal
    // which would screw up both our for-loop and the index to remove.
    for (let i = form.length - 1; i >= 0; i--) {
      const id = accessor(form.at(i).value);
      if (newIds.includes(id)) {
        currentIds.push(id);
        continue;
      }
      onRemove(i, false);
    }

    for (const edu of value) {
      if (currentIds.includes(accessor(edu))) {
        continue;
      }
      onAdd(edu);
    }
  }

  /**
   * Use this in subclass to handle loading new object.
   *
   * This is provided instead of an abstract "load" method
   * so we don't enforce what is needed to load the model.
   * It could just be an ID or maybe more - up to subclass.
   */
  protected get onLoad(): PartialObserver<T> {
    return {
      next: this.onNewSubject.bind(this),
      error: err => this._loadError.next(err)
    };
  }

  private onNewSubject(subject: T): void {
    this.changeEngine.reset();
    this._subject.next(subject);
  }
}
