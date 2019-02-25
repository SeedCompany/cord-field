import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreTestModule } from '@app/core/core-test.module';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { Location } from '../models/location';
import { Project } from '../models/project';
import { Role } from '../models/role';
import { User, UserListItem, UserProfile } from '../models/user';
import { UserService } from './user.service';

const testBaseUrl = environment.services['plo.cord.bible'];

describe('UserService', () => {
  let httpMock: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        CoreTestModule,
      ],
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
        {id: '5ae06f3da9941545df22cd49', firstName: 'Buzz'},
      ] as User[]);
  });

  it('get assignable roles of a user by location', (done: DoneFn) => {
    const userId = 'iBFFFGvBVlIpvsKVanrbIYVBaPwkDnhjjb0.n_cPm_zyG_7D7WWLDT7ozQ.zfUnrX9tXoPtWtDc9PLhUw';
    const locationId = 'k_foauq3eN9u2jY1MVqRFX4wWqQtUO8d48.0bC1uibdlYfT1Y2YdAoJlg.nLDmQf8HiSX-WLeysgBK2w';
    const project = Project.fromJson({
      location: Location.fromJson({
        id: locationId,
      }),
    });
    userService
      .getAssignableRoles(userId, project)
      .then((data: Role[]) => {
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        expect(data[0]).toBe('ad');
        expect(data[1]).toBe('fa');
        done();
      })
      .catch(done.fail);
    httpMock
      .expectOne(`${testBaseUrl}/users/${userId}/assignable-roles/${locationId}`)
      .flush(['ad', 'fa']);
  });

  it('get users', (done: DoneFn) => {
    userService
      .getUsers({ sort: 'name', dir: 'asc', page: 3, size: 10, filters: {}, search: '' })
      .subscribe(({ data: users, total }: { data: UserListItem[], total: number }) => {
        expect(total).toBeDefined();
        expect(Array.isArray(users)).toBeTruthy();
        done();
      }, done.fail);

    httpMock
      .expectOne({url: `${testBaseUrl}/users?sort=name&order=asc&limit=10&skip=20`, method: 'GET'})
      .flush([]);
  });

  it('get user by id', (done: DoneFn) => {
    const userId = 'iBFFFGvBVlIpvsKVanrbIYVBaPwkDnhjjb0.n_cPm_zyG_7D7WWLDT7ozQ.zfUnrX9tXoPtWtDc9PLhUw';
    const user = {id: userId};
    userService
      .getUser(userId)
      .subscribe((userProfile: UserProfile) => {
        expect(userProfile.id).toBeDefined();
        expect(Array.isArray(userProfile.roles)).toBeTruthy();
        done();
      }, done.fail);

    httpMock
      .expectOne({url: `${testBaseUrl}/users/${userId}`, method: 'GET'})
      .flush(UserProfile.fromJson(user));
  });

});
