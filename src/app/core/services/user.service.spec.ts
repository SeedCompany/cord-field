import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { ProjectRole } from '../models/project-role';
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

  it('get assignable roles of a user by location', (done: DoneFn) => {
    const userId = 'iBFFFGvBVlIpvsKVanrbIYVBaPwkDnhjjb0.n_cPm_zyG_7D7WWLDT7ozQ.zfUnrX9tXoPtWtDc9PLhUw';
    const locationId = 'k_foauq3eN9u2jY1MVqRFX4wWqQtUO8d48.0bC1uibdlYfT1Y2YdAoJlg.nLDmQf8HiSX-WLeysgBK2w';
    userService
      .getAssignableRoles(userId, locationId)
      .then((data: ProjectRole[]) => {
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        expect(data[0]).toBe('sys');
        expect(data[1]).toBe('fa');
        done();
      })
      .catch(done.fail);
    httpMock
      .expectOne(`${testBaseUrl}/users/${userId}/assignable-roles/${locationId}`)
      .flush(['sys', 'fa']);
  });

});
