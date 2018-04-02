import { inject, TestBed } from '@angular/core/testing';

import { AuthenticationStorageService } from './authentication-storage.service';
import { BrowserService } from './browser.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { LoggerService } from './logger.service';
import { LocalStorageService, SessionStorageService } from './storage.service';

describe('AuthenticationStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationStorageService,
        BrowserService,
        GoogleAnalyticsService,
        LocalStorageService,
        SessionStorageService,
        LoggerService]
    });
  });

  it('should be created', inject([AuthenticationStorageService], (service: AuthenticationStorageService) => {
    expect(service).toBeTruthy();
  }));
});
