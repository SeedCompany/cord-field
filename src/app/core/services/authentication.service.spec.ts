import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { CoreModule } from '../core.module';
import { AuthenticationService } from './authentication.service';

let httpMockService: HttpTestingController;
let authService: AuthenticationService;

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
