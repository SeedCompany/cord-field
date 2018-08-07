import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { AuthenticationService } from './authentication.service';

let httpMock: HttpTestingController;
let authService: AuthenticationService;

const testUser = {
  email: 'gowtham@olivetech.net',
  password: 'test',
  domain: 'field'
};

const testBaseUrl = environment.services['plo.cord.bible'];

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
    authService = TestBed.get(AuthenticationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));

  describe('login', () => {

    it('login$ observable triggers when successfully logged in', (done: DoneFn) => {
      let loggedIn: boolean;
      authService.login$.first().subscribe(() => {
        loggedIn = true;
      });

      authService
        .login(testUser.email, testUser.password, false)
        .then(() => {
          expect(loggedIn).toBeTruthy('login$ should have been called upon login');
          done();
        }, done.fail);

      httpMock
        .expectOne({url: `${testBaseUrl}/auth/native/login`, method: 'POST'})
        .flush(null);
    });
  });

  describe('logout', () => {
    it('logout$ observable triggered on logout', (done: DoneFn) => {
      let loggedOut: boolean;
      let order = '';

      authService
        .logout$
        .subscribe({
          next: () => {
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

  it('change password of a user', (done: DoneFn) => {
    const user = testUser;
    authService
      .changePassword(user.email, user.password, 'test')
      .then(done)
      .catch(done.fail);

    httpMock
      .expectOne({url: `${testBaseUrl}/auth/native/change-password`, method: 'PUT'})
      .flush([{}]);
  });
});
