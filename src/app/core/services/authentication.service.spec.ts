import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthenticationStorageService } from './authentication-storage.service';

import { AuthenticationService } from './authentication.service';
import { BrowserService } from './browser.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { ProfileApiService } from './http/profile-api.service';
import { LoggerService } from './logger.service';
import { LocalStorageService, SessionStorageService } from './storage.service';


let authService: AuthenticationService;

const testUsers = {
  testUser1: {
    email: 'testuser1@test.com',
    password: 'testPassword'
  }
}

const authUrl = `${environment.services['profile.illuminations.bible']}/`;

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

    authService = TestBed.get(AuthenticationService);
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));


  describe('login', () => {
    it('login$ observable triggers when successfully logged in', () => {
      const user = testUsers.testUser1;

      let loggedIn;
      let order = '';

      authService
        .login$
        .subscribe({
          next(tokens) {
            loggedIn = true;
            order += '2';
          },
          error: fail
        });

      order += '1';
      authService
        .login(user.email, user.password, true)
        .subscribe({
          next(tokens) {
            expect(loggedIn).toBeTruthy('login$ should have been called upon login');
            expect(order).toBe('12', 'something is wrong with this test if this occurs out of order');
            expect(tokens.length).toBe(1);
          },
          error: fail
        });
    });
  });
});
