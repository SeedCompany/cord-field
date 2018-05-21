import { Injectable } from '@angular/core';
import * as localforage from 'localforage';

@Injectable()
export class BrowserService {

  constructor() {
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
