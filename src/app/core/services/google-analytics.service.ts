import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {

  constructor() {
  }

  async error(message: string): Promise<void> {
    // TODO not implemented noop
    return Promise.resolve();
  }
}
