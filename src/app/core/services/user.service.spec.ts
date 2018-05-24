import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { User } from '../models/user';
import { UserService } from './user.service';

const testBaseUrl = environment.services['plo.cord.bible'];

describe('UserService', () => {
  let httpMock: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ]
    });
    userService = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Search', (done: DoneFn) => {
    userService
      .search('zer')
      .then((data) => {
        expect(data[0].firstName).toBe('Buzzer');
        done();
      })
      .catch(done.fail);

    httpMock
      .expectOne(`${testBaseUrl}/users/suggestions?term=zer`)
      .flush([
        {id: '5ae06f3da9941545df22cd03', firstName: 'Buzzer'},
        {id: '5ae06f3da9941545df22cd49', firstName: 'Buzz'}
      ] as User[]);
  });
});
