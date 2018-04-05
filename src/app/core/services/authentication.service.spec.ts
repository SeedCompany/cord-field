import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  inject,
  TestBed
} from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthenticationToken } from '../models/authentication-token';
import { AuthenticationStorageService } from './authentication-storage.service';

import { AuthenticationService } from './authentication.service';
import { BrowserService } from './browser.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { ProfileApiService } from './http/profile-api.service';
import { LoggerService } from './logger.service';
import {
  LocalStorageService,
  SessionStorageService
} from './storage.service';

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
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
