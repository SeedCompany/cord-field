import { Injectable, Optional } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as localforage from 'localforage';
import { filter, first } from 'rxjs/operators';

// Temp fix until auth can be done on SSR as well
localforage.defineDriver({
  _driver: 'null',
  _initStorage: () => {},
  clear: async () => {},
  getItem: async <T>() => (null as any as T),
  key: async () => '',
  keys: async () => [],
  setItem: async <T>(key: string, value: T) => value,
  removeItem: async () => {},
  length: async () => 0,
  iterate: async <T, U>() => (null as any as U)
});

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  private _firstNavigationFinished = false;

  constructor(@Optional() router?: Router) {
    if (router) {
      router.events
        .pipe(
          filter(e => e instanceof NavigationEnd),
          first()
        )
        .subscribe(() => this._firstNavigationFinished = true);
    }
  }

  get firstNavigationFinished(): boolean {
    return this._firstNavigationFinished;
  }

  get hasSessionStorage(): boolean {
    return 'sessionStorage' in this.window;
  }

  get hasLocalStorage(): boolean {
    return 'localStorage' in this.window;
  }

  get hasCache(): boolean {
    return 'caches' in this.window;
  }

  get document(): Document {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document
    return document;
  }

  get window(): Window {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window
    return typeof window === 'undefined' ? {} as Window : window;
  }

  get sessionStorage(): Storage | null {
    return this.hasSessionStorage ? this.window.sessionStorage : null;
  }

  get localforage(): LocalForage {
    return localforage;
  }
}
