import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { CoreModule } from '../core.module';
import { LocalStorageService, SessionStorageService } from './storage.service';

describe('StorageService', () => {

  const store = {
    local: undefined as LocalStorageService,
    session: undefined as SessionStorageService
  };
  const stores = Object.keys(store);

  beforeEach(async (done) => {
    TestBed
      .configureTestingModule({
        imports: [
          CoreModule
        ],
        providers: [
          LocalStorageService,
          SessionStorageService
        ]
      });

    store.local = TestBed.get(LocalStorageService);
    store.session = TestBed.get(SessionStorageService);

    Observable
      .forkJoin([
        store.local.clear(),
        store.session.clear()
      ])
      .subscribe(done, done.fail);
  });

  afterEach((done) => {
    Observable
      .forkJoin([
        store.local.clear(),
        store.session.clear()
      ])
      .subscribe(done, done.fail);
  });

  it('clear', async (done) => {
    try {

      for (const type of stores) {
        await store[type].setItem('clear-test', true).toPromise();
        expect(await store[type].length().toPromise()).toBe(2);
        expect(await store[type].clear().toPromise()).toBe(2);
        expect(await store[type].length().toPromise()).toBe(0);
      }

      done();
    } catch (err) {
      done.fail(err);
    }

  });

  describe('getItem', () => {
    it('string', async (done) => {
      try {
        for (const type of stores) {
          await store[type].setItem('test', 'test value').toPromise();
          expect(await store[type].getItem('test').toPromise()).toBe('test value');
        }

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('number', async (done) => {
      try {
        for (const type of stores) {
          await store[type].setItem('test', 777).toPromise();
          const n = await store[type].getItem('test').toPromise();
          expect(typeof n === 'number').toBeTruthy('should have been a number');
          expect(n).toBe(777);
        }

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('object', async (done) => {
      try {
        for (const type of stores) {
          await store[type].setItem('test', {test: 'value'}).toPromise();
          expect((await store[type].getItem('test').toPromise()).test).toBe('value');
        }
        done();
      } catch (err) {
        done.fail(err);
      }
    });

    fit('array', async (done) => {
      try {
        for (const type of stores) {
          await store[type].setItem('test', [1, 2, 3, 4, 5]).toPromise();
          expect(await store[type].getItem('test').toPromise()).toEqual([1, 2, 3, 4, 5]);
        }
        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });

  it('getStorageEngineType', async (done) => {
    try {
      for (const type of stores) {
        const result = await store[type].getStorageEngineType().toPromise();
        expect(result).toBe((type === 'session') ? 'session' : 'asyncStorage', type);
        done();
      }
    } catch (err) {
      done.fail(err);
    }
  });

  describe('observe', () => {
    it('emits when setItem updates an entry', async (done) => {
      try {
        for (const type of stores) {

          await store[type].setItem('test', 'test value').toPromise();
          expect(await store[type].getItem('test').toPromise()).toBe('test value');

          let updatedValue = '';
          const o = store[type]
            .observe('test')
            .subscribe((update) => updatedValue = update);

          await store[type].setItem('test', 'test value updated').toPromise();
          expect(updatedValue).toBe('test value updated');
          o.unsubscribe();
        }
        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('allows subscription before value set', async (done) => {
      try {
        for (const type of stores) {
          let updatedValue = '';
          const o = store[type]
            .observe('test')
            .subscribe((update) => updatedValue = update);

          await store[type].setItem('test', 'test value').toPromise();
          expect(await store[type].getItem('test').toPromise()).toBe('test value');

          await store[type].setItem('test', 'test value updated').toPromise();
          expect(updatedValue).toBe('test value updated');
          o.unsubscribe();
        }
        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });

  it('key', async (done) => {
    try {
      for (const type of stores) {
        await store[type].setItem('val1', 1).toPromise();
        await store[type].setItem('val2', 2).toPromise();

        expect(await store[type].key(0).toPromise()).toBe(store[type]['getKey']('val1'));
        expect(await store[type].key(1).toPromise()).toBe(store[type]['getCacheKey']('val1'));
        expect(await store[type].key(2).toPromise()).toBe(store[type]['getKey']('val2'));
        expect(await store[type].key(3).toPromise()).toBe(store[type]['getCacheKey']('val2'));

      }
      done();
    } catch (err) {
      done.fail(err);
    }
  });

  it('length', async (done) => {
    try {

      for (const type of stores) {
        await store[type].setItem('test-val-1', true).toPromise();
        await store[type].setItem('test-val-2', true).toPromise();
        await store[type].setItem('test-val-3', true).toPromise();
        await store[type].setItem('test-val-4', true).toPromise();
        expect(await store[type].length().toPromise()).toBe(8);
      }

      done();
    } catch (err) {
      done.fail(err);
    }

  });

  it('removeItem', async (done) => {
    try {
      for (const type of stores) {
        await store[type].setItem('test', 'test value').toPromise();
        expect(await store[type].getItem('test').toPromise()).toBe('test value');

        await store[type].removeItem('test').toPromise();
        expect(await store[type].getItem('test').toPromise()).toBe(null);
      }

      done();
    } catch (err) {
      done.fail(err);
    }
  });

  describe('setItem', () => {
    it('basic function', async (done) => {
      // developer note: the various tests for setting are taken care of in the getItem section above.
      try {
        for (const type of stores) {
          expect(await store[type].setItem('test', 'test value').toPromise()).toBe('test value');
          expect(await store[type].getItem('test').toPromise()).toBe('test value');
        }

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('sets value and cache entry', async (done) => {
      try {
        for (const type of stores) {
          await store[type].setItem('test', 'test value').toPromise();
          const valueKey = store[type]['getKey']('test');
          const cacheKey = store[type]['getCacheKey']('test');
          expect(await store[type].key(0).toPromise()).toBe(valueKey, type);
          expect(await store[type].key(1).toPromise()).toBe(cacheKey, type);
        }

        done();
      } catch (err) {
        done.fail(err);
      }
    });

  });

  describe('cache', () => {
    it('getItem expires value', async (done) => {

      try {

        for (const type of stores) {
          await store[type].setItem('test', 'should be expired (null)', 1).toPromise();
          expect(await store[type].getItem('test').toPromise()).toBe('should be expired (null)', type);

          await new Promise((resolve) => setTimeout(resolve, 1010));
          expect(await store[type].getItem('test').toPromise()).toBe(null, type);
        }

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('getItem removes expired value', async (done) => {

      try {

        for (const type of stores) {
          await store[type].setItem('test', 'should be expired (null)', 1).toPromise();
          expect(await store[type].getItem('test').toPromise()).toBe('should be expired (null)', type);

          await new Promise((resolve) => setTimeout(resolve, 1010));
          expect(await store[type].getItem('test').toPromise()).toBe(null, type);
          expect(await store[type].key(0).toPromise()).toBe(null, type);
        }

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('clearExpiredCache', async (done) => {
      try {
        for (const type of stores) {
          await store[type].setItem('test', 'some value', 1).toPromise();
          expect(await store[type].getItem('test').toPromise()).toBe('some value');

          await new Promise((resolve) => setTimeout(resolve, 1010));
          await store[type].clearExpiredCache().toPromise();
          expect(await store[type].getItem('test').toPromise()).toBe(null, type);
        }

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('garbage collects if told to', async (done) => {
      try {
        for (const type of stores) {
          await store[type].setItem('test', 'a value', 1, true).toPromise();
          expect(await store[type].getItem('test').toPromise()).toBe('a value', type);
          expect(await store[type].length().toPromise()).toBe(2, type);

          await new Promise((resolve) => setTimeout(resolve, 1010));
          expect(await store[type].length().toPromise()).toBe(0, type);
        }

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('does not garbage collect by default', async (done) => {
      try {
        for (const type of stores) {
          await store[type].setItem('test', 'a value', 1, false).toPromise();
          expect(await store[type].getItem('test').toPromise()).toBe('a value', type);
          expect(await store[type].length().toPromise()).toBe(2, type);

          await new Promise((resolve) => setTimeout(resolve, 1010));
          expect(await store[type].length().toPromise()).toBe(2, type);
          expect(await store[type].getItem('test').toPromise()).toBe(null, type);
        }

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    describe('getCachedObservable', () => {
      it('calls observable if not yet cached', async (done) => {
        try {
          for (const type of stores) {

            const obs = Observable.of('observable called');
            await store[type].getCachedObservable('test', obs).toPromise();
            expect(await store[type].getItem('test').toPromise()).toBe('observable called', type);
          }
          done();
        } catch (err) {
          done.fail(err);
        }
      });

      it('returns cached value instead of observable', async (done) => {
        try {
          for (const type of stores) {

            const obs = Observable.of('observable called');
            await store[type].setItem('test', 'cached value');
            expect(await store[type].getCachedObservable('test', obs).toPromise()).toBe('cached value', type);
          }
          done();
        } catch (err) {
          done.fail(err);
        }
      });

      it('returns observable value after cache expiration', async (done) => {
        try {
          for (const type of stores) {
            const obs = Observable.of('observable called');
            await store[type].setItem('test', 'cached value', 1);
            expect(await store[type].getCachedObservable('test', obs).toPromise()).toBe('cached value', type);

            await new Promise((resolve) => setTimeout(resolve, 1010));
            expect(await store[type].getCachedObservable('test', obs).toPromise()).toBe('observable called', type);

          }
          done();
        } catch (err) {
          done.fail(err);
        }
      });
    });
  });
});
