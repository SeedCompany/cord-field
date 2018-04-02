import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BrowserService } from './browser.service';

export type StorageEngineType = 'asyncStorage' | 'localStorageWrapper' | 'session' | 'webSQLStorage';

/**
 * Base class for storage services. Supports:
 *  - ttl caching (including active garbage collection of expired items)
 *  - observing entries for changes
 *  - intercepting an observable and returning a cache result, if valid
 */
export abstract class BaseStorageService<TStore extends any> {

  /**
   * Sets the name of the database in IndexedDB or Web SQL, otherwise sets the first part of the prefix for the item
   * name in local or session storage (e.g., db_name/collection_name/item_name).
   * @returns {string}
   */
  abstract get dbName(): string;

  /**
   * Sets what gets attached to the cache metadata entry to identify it as such. For example, if you have an
   * item named "magic-item", and your cache postfix is set to "ttl", then your cache metadata entry for "magic-item"
   * will be "magic-item-ttl". Pick a postfix that won't collide with other entries you're using.
   * @returns {string}
   */
  abstract get cachePostfix(): string;

  /**
   * Sets the name of the collection in IndexedDB or Web SQL, otherwise sets the second part of the prefix for the item
   * name in local or session storage (e.g., db_name/collection_name/item_name).
   * @returns {string}
   */
  abstract get collectionName(): string;

  /**
   * As garbage collected items are set, the reference to their timers are kept here. They are removed
   * upon completion, upon `setItem` with an existing timer being called, or upon `removeItem` being called
   */
  private gcs = {};
  /**
   * As items are added, their Subjects are instantiated to allow Observing of that item via
   * [[StorageService.observe]].
   */
  private subjects = {};
  private isLocalForage = false;

  constructor(protected store: TStore) {
    this.isLocalForage = 'setDriver' in this.store;
  }

  /**
   * Clears all entries for the data store
   * @param {boolean} all
   * @returns {Observable<number>}
   */
  clear(all = true): Observable<number> {
    const p = async (): Promise<number> => {

      const len = await this.length().toPromise();
      await this.store.clear();

      const keys = Object.keys(this.subjects);
      for (const key of keys) {
        this.subjects[key].complete();
        delete this.subjects[key];
      }

      return len;
    };

    return Observable.fromPromise(p());
  }

  /**
   * Purges all expired cache entries in storage. This should be called during application startup
   * to remove any entries that weren't actively removed prior to application shutdown. You could
   * also call this in the onDestroy hook for your application.
   * @returns {Observable<void>}
   */
  clearExpiredCache(): Observable<void> {
    return this
      .length()
      .do(async (len) => {
        // build an immutable list of keys
        const keys = [];
        for (let i = 0; i < len; i++) {
          keys.push(await this.key(i).toPromise());
        }

        for (const key of keys) {
          if (this.isCacheKey(key)) {
            continue;
          }

          const rawKey = this.getRawKey(key);
          if (rawKey === null) {
            // isn't a key being managed by the storage service
            continue;
          }

          const cache = await this.getItemCache(rawKey);
          if (this.isCacheExpired(cache)) {
            await this.removeItem(key);
          }
        }
      })
      .map(() => null);
  }

  /**
   * Gets an item from the storage library and supplies the result as an observable.
   * If the key does not exist, getItem() will return null to the subscriber.
   * @param {string} key
   * @returns {Observable<T>}
   */
  getItem<T>(key: string): Observable<T> {
    const p = async (): Promise<T> => {
      let val = await this.store.getItem(this.getKey(key));
      const cache = await this.getItemCache(key);

      if (this.isCacheExpired(cache)) {
        await this.removeItem(key).toPromise();
        val = null;
      }

      return val;
    };
    return Observable.fromPromise(p());
  }

  /**
   * Should return the name of the storage engine being used.
   * @returns {Observable<string>}
   */
  abstract getStorageEngineType(): Observable<StorageEngineType>;

  getCachedObservable<T>(key: string, observable: Observable<T>, cacheTTL = 0, gc = false): Observable<T> {
    return this
      .getItem(key)
      .map((val) => val || null)
      .flatMap((val: any) => (val !== null)
        ? Observable.of(val)
        : observable.flatMap((obsVal: any) => this.setItem(key, obsVal, cacheTTL, gc)));
  }

  /**
   * Gets an observable that emits an updated value each time its key is set. Use this to monitor changes to a key/value
   * in the store.
   * @param {string} key
   * @returns {Observable<T>}
   */
  observe<T>(key: string): Observable<T> {
    if (!(key in this.subjects)) {
      this.subjects[key] = new Subject<T>();
    }

    return this.subjects[key].asObservable();
  }

  /**
   * Get the name of a key based on its ID.
   * @param {number} keyIndex
   * @returns {Observable<T>}
   */
  key(keyIndex: number): Observable<string> {
    const p = async () => {
      return await this.store.key(keyIndex);
    };

    return Observable.fromPromise(p());
  }

  /**
   * Gets the number of keys in the store. Note that the count will be double what you're expecting because each
   * entry has a corresponding cache ttl entry.
   * @returns {Observable<number>}
   */
  length(): Observable<number> {
    const p = async () => {
      if (typeof this.store.length === 'function') {
        return await this.store.length();
      } else {
        return this.store.length;
      }
    };

    return Observable.fromPromise(p());
  }

  /**
   * Removes the value of a key from the store.
   * @param {string} key
   * @returns {Observable<void>}
   */
  removeItem(key: string): Observable<void> {
    const p = async () => {

      if (key in this.gcs) {
        clearTimeout(this.gcs[key]);
        delete this.gcs[key];
      }

      await Promise.all([
        this.store.removeItem(this.getKey(key)),
        this.store.removeItem(this.getCacheKey(key))
      ]);

      if (key in this.subjects) {
        this.subjects[key].complete();
        delete this.subjects[key];
      }
    };

    return Observable.fromPromise(p());
  }

  /**
   * Saves data to a store and returns that value as an Observable
   * @param {string} key
   * @param {T} value
   * @param {number} cacheTTL the title to live for the item in seconds. Defaults to 0 (disabled)
   * @param {boolean} gc if true, the entry will be actively garbage collected
   * @returns {Observable<T>}
   */
  setItem<T>(key: string, value: T, cacheTTL = 0, gc = false): Observable<T> {
    const p = async () => {
      if (!(key in this.subjects)) {
        this.subjects[key] = new Subject<string>();
      }

      if (cacheTTL > 0) {
        const now = new Date();
        now.setSeconds(now.getSeconds() + cacheTTL);
        cacheTTL = +now;
      }

      if (cacheTTL > 0 && gc) {
        if (key in this.gcs) {
          clearTimeout(this.gcs[key]);
          delete this.gcs[key];
        }

        const ms = cacheTTL - +(new Date());
        if (ms > 0) {
          this.gcs[key] = setTimeout(() => this.removeItem(key), ms);
        }
      }

      await Promise.all([
        this.store.setItem(this.getKey(key), value),
        this.store.setItem(this.getCacheKey(key), cacheTTL)
      ]);

      this.subjects[key].next(value);

      return value;
    };

    return Observable.fromPromise(p());
  }

  /**
   * Builds the name for the cache key to use when storing an item
   * @param {string} key
   * @returns {string}
   */
  private getCacheKey(key: string): string {
    return `${this.getKey(key)}-${this.cachePostfix}`;
  }

  /**
   * Returns the cache metadata for the provided key (the key should be a raw key, not a stored key)
   * @param {string} key the raw key for the item (i.e., the one you provided, not the one stored)
   * @returns {Promise<number>}
   */
  private getItemCache(key: string): Promise<number> {
    return this.store.getItem(this.getCacheKey(key));
  }

  /**
   * Builds the name of the key to use when storing an item
   * @param {string} key the name of the key to be stored
   * @returns {string}
   */
  private getKey(key: string): string {
    return (this.isLocalForage) ? key : `${this.getSessionPrefix()}${key}`;
  }

  /**
   * Takes a stored key and returns it to its raw form (the key name the integrator provided)
   * @param {string} key the stored key to be converted back to the raw key form
   * @returns {string} returns null if the key is not a key compatible with the storage system (it got into the store
   * by some other means than this library).
   */
  private getRawKey(key: string): string {
    if (this.isLocalForage) {
      return key;
    }

    const keyParts = key.split('/');
    return keyParts.length === 3
      ? (keyParts[0] === this.dbName && keyParts[1] === this.collectionName) ? keyParts[2] : null
      : null;
  }

  /**
   * Builds the prefix for items keys that are used for session storage (these are designed to match the
   * keys used by localforages local storage keys.
   * @returns {string}
   */
  private getSessionPrefix(): string {
    return `${this.dbName}/${this.collectionName}/`;
  }

  /**
   * Takes a stored key and returns true if it is a cache key (i.e., the entry is a cache metadata entry
   * @param {string} key the key from storage
   * @returns {boolean} true if the key matches tha pattern for a cache metadata entry
   */
  private isCacheKey(key: string): boolean {
    if (this.isLocalForage) {
      return key.endsWith(`-${this.cachePostfix}`);
    }

    const keyParts = key.split('/');
    return keyParts.length === 3
      ? keyParts[2].endsWith(`-${this.cachePostfix}`)
      : null;
  }

  /**
   * Takes a cache value and returns true if the cache is expired. Always returns false if the
   * cache entry is 0 (i.e., no cache ttl was set)
   * @param {number} cache the cache metadata for the entry
   * @returns {boolean}
   */
  private isCacheExpired(cache: number): boolean {
    if (cache > 0) {
      const expire = new Date(+cache);
      const now = new Date();
      return (+now > +expire);
    }

    return false;
  }

}

/**
 * Stores items for offline using the best available method in the browser via the localForage library.
 * Values can be any valid type supported by localForage.
 */
@Injectable()
export class LocalStorageService extends BaseStorageService<LocalForage> {

  private storageEngine: StorageEngineType;

  get dbName(): string {
    return 'app_db';
  }

  get cachePostfix(): string {
    return 'ttl';
  }

  get collectionName(): string {
    return 'app_kv_storage';
  }

  constructor(browserService: BrowserService) {
    super(browserService.localforage);
    this.store
      .config({
        name: this.dbName,
        storeName: this.collectionName
      });
  }

  getStorageEngineType(): Observable<StorageEngineType> {
    if (!this.storageEngine) {
      return Observable
        .fromPromise(
          this.store
            .ready()
            .then(() => {
              this.storageEngine = this.store.driver() as StorageEngineType;
              return this.storageEngine;
            })
            .catch(Promise.reject)
        );
    }

    return Observable.of(this.storageEngine);
  }
}

/**
 * Stores items in session. Use getJson and setJson to store non-string values.
 */
@Injectable()
export class SessionStorageService extends BaseStorageService<Storage> {
  get dbName(): string {
    return 'app_db';
  }

  get cachePostfix(): string {
    return 'ttl';
  }

  get collectionName(): string {
    return 'app_kv_storage';
  }

  constructor(browserService: BrowserService) {
    super(browserService.sessionStorage);
  }

  getItem<T>(key: string): Observable<T> {
    return super
      .getItem<T>(key)
      .map((r: any) => {
        let val;
        try {
          val = JSON.parse(r);
        } catch (e) {
          val = r;
        }
        return val;
      });
  }

  getStorageEngineType(): Observable<StorageEngineType> {
    return Observable.of<StorageEngineType>('session');
  }

  setItem<T>(key: string, value: T, cacheTTL = 0, gc = false): Observable<T> {
    let val: any = value;
    if (typeof value !== 'string') {
      try {
        val = JSON.stringify(val);
      } finally {
        // fail silent
      }
    }

    return super
      .setItem<T>(key, val, cacheTTL, gc)
      .map((r: any) => {
        let result;
        try {
          result = JSON.parse(r);
        } catch (e) {
          result = r;
        }

        return result;
      });
  }
}
