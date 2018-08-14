import { of as observableOf, throwError as observableThrow } from 'rxjs';
import { first } from 'rxjs/operators';
import { AbstractViewState, SaveResult } from './abstract-view-state';
import { returnSelf } from './change-engine';

interface TestSubject {
  foo: string;
  bar: string;
}

class TestViewState extends AbstractViewState<TestSubject> {

  saving = false;
  saveFails = false;

  constructor() {
    super(
      {
        foo: {
          accessor: returnSelf
        },
        bar: {
          accessor: returnSelf,
          forceRefresh: true // "bar has side effects when saving"
        }
      },
      {
        foo: 'initial',
        bar: 'initial'
      }
    );
  }

  next(subject: TestSubject) {
    observableOf(subject)
      .subscribe(this.onLoad);
  }

  loadWithError() {
    observableThrow(new Error('Loading failed'))
      .subscribe(this.onLoad);
  }

  async onSave(obj: TestSubject, changes: any): Promise<SaveResult<TestSubject>> {
    if (this.saveFails) {
      throw new Error('Failed');
    }

    this.saving = false;

    return {};
  }

  public refresh(obj: TestSubject): void {}
}

describe('AbstractViewState', () => {
  let viewState: TestViewState;

  beforeEach(() => {
    viewState = new TestViewState();
  });

  describe('Loading', () => {
    it('has initial value', async () => {
      const subject = await viewState.subject.pipe(first()).toPromise();
      await expect(subject.foo).toEqual('initial');
    });

    it('sets subject', async () => {
      viewState.next({foo: 'next', bar: 'next'});

      const subject = await viewState.subject.pipe(first()).toPromise();
      await expect(subject.foo).toEqual('next');
    });

    it('observes errors', async () => {
      let error: Error | undefined;
      viewState.loadError.subscribe(e => error = e);
      expect(error).toBeUndefined();

      viewState.loadWithError();

      expect(error!).toEqual(new Error('Loading failed'));
    });
  });

  describe('Changes', () => {
    it('dirty', () => {
      let dirty = false;
      viewState.isDirty.subscribe(d => dirty = d);
      expect(dirty).toBeFalsy('dirty should be false initially');

      viewState.change({
        foo: 'changed'
      });
      expect(dirty).toBeTruthy();
    });

    it('discard', () => {
      let dirty = false;
      viewState.isDirty.subscribe(d => dirty = d);

      viewState.change({
        foo: 'changed'
      });
      viewState.discard();

      expect(dirty).toBeFalsy();
    });
  });

  describe('Saving', () => {
    beforeEach(() => {
      viewState.change({
        foo: 'changed'
      });
    });

    it('observe submitting', async () => {
      let called = 0;
      viewState.isSubmitting.subscribe(s => {
        if (called === 0) {
          expect(s).toBeFalsy('submitting should initially be false');
        } else if (called === 1) {
          expect(s && viewState.saving).toBeTruthy('submitting should true while saving');
        } else if (called === 2) {
          expect(s && !viewState.saving).toBeFalsy('submitting should be false after saving');
        } else {
          fail('Too much');
        }
        ++called;
      });

      viewState.saving = true;
      await viewState.save();

      if (called <= 1) {
        fail('isSubmitting not changed');
      }
    });

    it('error throws', async () => {
      viewState.saveFails = true;

      let error = false;
      try {
        await viewState.save();
      } catch (e) {
        error = true;
      }
      expect(error).toBeTruthy("save() should've thrown error");

      expect(await viewState.isSubmitting.pipe(first()).toPromise()).toBeFalsy('Submitting should be reset to false even on error');
    });

    it('next subject', async () => {
      let subject: TestSubject;
      viewState.subject.subscribe(s => subject = s);
      viewState.change({
        foo: 'changed'
      });

      await viewState.save();

      expect(subject!).toEqual({foo: 'changed', bar: 'initial'});
    });

    it('clears current changes', async () => {
      let dirty = false;
      viewState.isDirty.subscribe(d => dirty = d);

      viewState.change({
        foo: 'changed'
      });
      await viewState.save();

      expect(dirty).toBeFalsy();
    });
  });

  describe('Force Refresh', () => {
    it('Should call refresh() when change with forceRefresh is saved', async () => {
      viewState.change({
        bar: 'changed'
      });

      spyOn(viewState, 'refresh');
      await viewState.save();
      expect(viewState.refresh).toHaveBeenCalledTimes(1);
    });

    it('Should not call refresh() when change that does not have forceRefresh is saved', async () => {
      spyOn(viewState, 'refresh');
      await viewState.save();
      expect(viewState.refresh).toHaveBeenCalledTimes(0);
    });
  });
});
