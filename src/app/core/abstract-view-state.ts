import { OnDestroy } from '@angular/core';
import { BaseStorageService } from '@app/core/services/storage.service';
import { ArrayItem } from '@app/core/util';
import { ViewStateFormBuilder } from '@app/core/view-state-form-builder';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { BehaviorSubject, combineLatest, NextObserver, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';
import { LazyGetter } from 'typescript-lazy-get-decorator';
import { ChangeConfig, ChangeEngine, Changes } from './change-engine';

export type SaveResult<T> = {[key in keyof Partial<T>]: string[]};

export abstract class AbstractViewState<T extends { id: string }, ModifiedForServer> extends SubscriptionComponent implements OnDestroy {

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
    super();

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
  protected abstract onSave(subject: T, changes: ModifiedForServer): Promise<SaveResult<T>>;

  /**
   * Called when the model needs to be refreshed from the server.
   * The method should call this.onLoad at some point.
   */
  protected abstract refresh(subject: T): void;

  /**
   * Identify the given subject to use as a cache key.
   */
  protected abstract identify(subject: T): string;

  @LazyGetter()
  get fb(): ViewStateFormBuilder<T> {
    return new ViewStateFormBuilder(this, this.changeEngine);
  }

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

  revert<K extends keyof T>(field: K, item?: ArrayItem<T[K]>): void {
    this.changeEngine.revert(field, item);
    this.changes.next();
  }

  async save(): Promise<void> {
    this.submitting.next(true);

    let result;
    try {
      const modified = this.changeEngine.getModifiedForServer(this._subject.value);
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
    super.ngOnDestroy();

    if (window) {
      window.removeEventListener('beforeunload', this.beforeUnload);
    }
    this.storeModifications();
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
