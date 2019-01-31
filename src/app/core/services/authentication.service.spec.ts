import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { CoreTestModule } from '@app/core/core-test.module';
import { first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { AuthenticationService } from './authentication.service';

let httpMock: HttpTestingController;
let authService: AuthenticationService;

const testUser = {
  email: 'gowtham@olivetech.net',
  password: 'test',
  domain: 'field',
};

const testBaseUrl = environment.services['plo.cord.bible'];

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        CoreTestModule,
      ],
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
