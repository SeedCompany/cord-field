import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { AuthenticationToken } from '../models/authentication-token';
import { AuthenticationService } from './authentication.service';


let httpMockService: HttpTestingController;
let authService: AuthenticationService;

const testBaseUrl = environment.services['profile.illuminations.bible'];

const testUser = {
  email: 'gowtham@olivetech.net',
  password: 'test',
  domain: 'field'
};

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientModule,
        HttpClientTestingModule
      ]
    });

    httpMockService = TestBed.get(HttpTestingController);
    authService = TestBed.get(AuthenticationService);
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));

  describe('login', () => {

    it('should test login using test user', (done: DoneFn) => {

      const loginUrl = `${testBaseUrl}/auth/native/login`;
      const mockResponse = {
        'token': {
          'profile.illuminations.bible': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdvd3RoYW1Ab2xpdmV0' +
          'ZWNoLm5ldCIsImRvbWFpbiI6ImZpZWxkIiwiZmlyc3ROYW1lIjoiR293dGhhbSIsImxhc3ROYW1lIjoiUm9kZGEiLCJpZCI6IjVhY' +
          '2I0NjNkY2YwYmRjMDc4MjgzMGJjNSIsImlzc1NpZyI6IjYzNjJkZjQxNzM2MTE1YzE1YTUwMDUzZDQyM2RlYzQwOTRhYzQzZjFiODR' +
          'lNjUwM2QxNTIxM2UyNzcwMGZhZWQiLCJpYXQiOjE1MjMyNzI0MzIsImV4cCI6MTUyMzQ0NTIzMiwiYXVkIjoicHJvZmlsZS5pbGx1b' +
          'WluYXRpb25zLmJpYmxlIiwiaXNzIjoicHJvZmlsZS5pbGx1bWluYXRpb25zLmJpYmxlIiwianRpIjoiOTI1OWM5NzAtZjk1YS00Y2V' +
          'lLTgyN2QtMzMwYjEwY2JlNTk0In0.6qYGuESle_M1oGpQ1HrbqH4gzEkK96e5r7tvT26cFP4'
        }
      };

      authService
        .login(testUser.email, testUser.password, false)
        .then((response: AuthenticationToken[]) => {
          expect(response[0].email).toBe('gowtham@olivetech.net');
          expect(response[0].key).toBe('profile.illuminations.bible');
          expect(response[0].domain).toBe('field');
          done();
        })
        .catch(done.fail);
      httpMockService.expectOne(loginUrl).flush(mockResponse);
      httpMockService.verify();

    });

    it('login$ observable triggers when successfully logged in', () => {
      const user = testUser;

      let loggedIn: boolean;
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
        .login(user.email, user.password, false)
        .then(tokens => {
          expect(loggedIn).toBeTruthy('login$ should have been called upon login');
          expect(order).toBe('12', 'something is wrong with this test if this occurs out of order');
          expect(tokens.length).toBe(1);
        })
        .catch(error => error.fail);
    });
  });

  describe('logout', () => {
    it('logout$ observable triggered when loggout out', (done: DoneFn) => {
      let loggedOut: boolean;
      let order = '';

      authService
        .logout$
        .subscribe({
          next(tokens) {
            loggedOut = true;
            order += '2';
          },
          error: fail
        });

      order += '1';
      authService
        .logout()
        .then(() => {
          expect(loggedOut).toBeTruthy('logout$ should have been called upon logout');
          expect(order).toBe('12', 'something is wrong with this test if this occurs out of order');
          done();
        })
        .catch(done.fail);
    });
  });
});
