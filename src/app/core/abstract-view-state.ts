import { OnDestroy } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { BaseStorageService } from '@app/core/services/storage.service';
import { ArrayItem } from '@app/core/util';
import { BehaviorSubject, combineLatest, merge, NextObserver, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { LazyGetter } from 'typescript-lazy-get-decorator';
import { ChangeConfig, ChangeEngine, Changes } from './change-engine';

export type SaveResult<T> = {[key in keyof Partial<T>]: string[]};

export abstract class AbstractViewState<T> implements OnDestroy {

  private readonly changeEngine: ChangeEngine<T>;
  private readonly _subject: BehaviorSubject<T>;
  private readonly submitting = new BehaviorSubject<boolean>(false);
  private readonly _loadError = new Subject<Error>();
  /** Subject to track when changes have been made to recalculate subjectWithChanges */
  private readonly changes = new Subject<void>();

  protected constructor(
    config: ChangeConfig<T>,
    initial: T,
    private storage: BaseStorageService<any> | null = null,
  ) {
    this.changeEngine = new ChangeEngine(config);
    this._subject = new BehaviorSubject<T>(initial);

    if (window) {
      window.addEventListener('beforeunload', this.beforeUnload);
    }
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

  /**
   * Identify the given subject to use as a cache key.
   */
  protected abstract identify(subject: T): string;

  get subject(): Observable<T> {
    return this._subject.asObservable();
  }

  @LazyGetter()
  get subjectWithPreExistingChanges(): Observable<T> {
    return this.subject
      .pipe(
        map((val) => this.changeEngine.getModified(val)),
        shareReplay(1),
      );
  }

  @LazyGetter() // Calculate pipe once, when requested
  get subjectWithChanges(): Observable<T> {
    return combineLatest(
      this.subject,
      this.changes.pipe(startWith(null)), // Fire off when changes are made, but don't wait for it
    )
      .pipe(
        map(([val]) => this.changeEngine.getModified(val)),
        distinctUntilChanged(),
        shareReplay(1), // Share latest value to new subscribers just like a BehaviorSubject would
      );
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
    this.changes.next();
  }

  revert(field: keyof T, item?: any): void {
    this.changeEngine.revert(field, item);
    this.changes.next();
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

    await this.clearModifications();
    this.onNewSubject(next);

    if (needsRefresh) {
      this.refresh(next);
    }
  }

  async discard(): Promise<void> {
    await this.clearModifications();
    this.onNewSubject(this._subject.value);
  }

  ngOnDestroy(): void {
    if (window) {
      window.removeEventListener('beforeunload', this.beforeUnload);
    }
    this.storeModifications();
  }

  /**
   * Create a form array for the given field. This syncs user input and subject changes to the form array
   * and gives back the control and functions to add & remove items from the array.
   */
  createFormArray<Key extends keyof T, Value extends ArrayItem<T[Key]>>(
    field: Key,
    createControl: (item: Value | undefined, remove: Observable<any>) => AbstractControl,
    unsubscribe: Observable<void>,
  ) {
    const form = new FormArray([]);

    // Subjects called on individual item removal
    const subs: Array<Subject<void>> = [];

    const add = (item?: any): void => {
      const removalSubject = new Subject<void>();
      const removeOrDestroy = merge(unsubscribe, removalSubject);

      const control = createControl(item, removeOrDestroy);

      control.valueChanges
        .pipe(takeUntil(removeOrDestroy))
        .subscribe(() => {
          if (control.valid) {
            this.change({[field]: {update: control.value}} as any);
          } else {
            this.revert(field, control.value);
          }
        });

      form.push(control);
      subs.push(removalSubject);
    };

    const remove = (index: number, updateState = true): void => {
      const fg = form.at(index);
      form.removeAt(index);
      if (subs[index]) {
        subs[index].next();
        subs[index].complete();
        subs.splice(index, 1);
      }
      if (updateState) {
        this.change({[field]: {remove: fg.value}} as any);
      }
    };

    this.subjectWithPreExistingChanges
      .pipe(takeUntil(unsubscribe))
      .subscribe(subject => {
        this.setupFormArrayItems(form, field, subject[field] as any, add, remove);
      });

    return {
      control: form,
      add,
      remove,
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
    onRemove: (index: number, updateState?: boolean) => void,
  ): void {
    const accessor = this.changeEngine.config[field].accessor;

    const newIds = value.map(accessor);
    const currentIds = [];

    // Remove old items in reverse order because FormArray re-indexes on removal
    // which would screw up both our for-loop and the index to remove.
    for (let i = form.length - 1; i >= 0; i--) {
      const id = accessor(form.at(i).value);
      const idx = newIds.indexOf(id);
      if (idx >= 0) {
        form.at(i).reset(value[idx], { emitEvent: false }); // Update value
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
  protected get onLoad(): NextObserver<T> {
    return {
      next: subject => this.onNewSubject(subject, true),
      error: err => this._loadError.next(err),
    };
  }

  private onNewSubject(subject: T, restoreCache = false): void {
    this.changeEngine.reset();
    if (restoreCache && this.storage) {
      this.changeEngine.restoreModifications(this.storage, this.identify(subject))
        .then(() => {
          this._subject.next(subject);
        });
    } else {
      this._subject.next(subject);
    }
  }

  private beforeUnload = (event: BeforeUnloadEvent) => {
    this.storeModifications();
  };

  private async clearModifications() {
    if (this.storage) {
      await this.changeEngine.clearModifications(this.storage, this.identify(this._subject.value));
    }
  }

  private async storeModifications() {
    if (this.storage) {
      await this.changeEngine.storeModifications(this.storage, this.identify(this._subject.value));
    }
  }
}
