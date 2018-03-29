import {Injectable} from '@angular/core';

@Injectable()
export class GoogleAnalyticsService {

  constructor() {
  }

  async error(message: string): Promise<void> {
    // TODO not implemented noop
    return Promise.resolve();
  }
}
