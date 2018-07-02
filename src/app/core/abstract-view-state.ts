import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { PartialObserver } from 'rxjs/src/Observer';
import { Subject } from 'rxjs/Subject';
import { ChangeConfig, ChangeEngine, Changes } from './change-engine';

export type SaveResult<T> = {[key in keyof Partial<T>]: string[]};

export abstract class AbstractViewState<T> {

  private readonly changeEngine: ChangeEngine<T>;
  private readonly _subject: BehaviorSubject<T>;
  private readonly submitting = new BehaviorSubject<boolean>(false);
  private readonly _loadError = new Subject<Error>();

  protected constructor(config: ChangeConfig<T>, initial: T) {
    this.changeEngine = new ChangeEngine(config);
    this._subject = new BehaviorSubject<T>(initial);
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
