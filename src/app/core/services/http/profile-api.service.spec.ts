import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { AuthenticationStorageService } from '../authentication-storage.service';
import { BrowserService } from '../browser.service';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { LoggerService } from '../logger.service';
import { LocalStorageService, SessionStorageService } from '../storage.service';

import { ProfileApiService } from './profile-api.service';

describe('ProfileApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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

  it('should be created', inject([ProfileApiService], (service: ProfileApiService) => {
    expect(service).toBeTruthy();
  }));
});
