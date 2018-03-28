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
    return window;
  }

  get sessionStorage(): Storage | null {
    return (this.window || {} as any).sessionStorage || null;
  }

  get localforage(): LocalForage {
    return localforage;
  }
}
