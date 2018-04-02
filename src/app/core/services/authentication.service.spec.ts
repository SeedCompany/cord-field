import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { AuthenticationStorageService } from './authentication-storage.service';

import { AuthenticationService } from './authentication.service';
import { BrowserService } from './browser.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { ProfileApiService } from './http/profile-api.service';
import { LoggerService } from './logger.service';
import { LocalStorageService, SessionStorageService } from './storage.service';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        AuthenticationStorageService,
        BrowserService,
        GoogleAnalyticsService,
        LocalStorageService,
        LoggerService,
        ProfileApiService,
        SessionStorageService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
