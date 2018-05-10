import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { Organization } from '../models/organization';
import { OrganizationService } from './organization.service';

const testBaseUrl = environment.services['plo.cord.bible'];

describe('OrganizationService', () => {

  let httpMock: HttpTestingController;
  let organizationService: OrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ],
      providers: [
        OrganizationService
      ]
    });
    organizationService = TestBed.get(OrganizationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Search', (done: DoneFn) => {
    organizationService
      .search('zer')
      .then((data) => {
        expect(data[0].name).toBe('Buzzer');
        done();
      })
      .catch(done.fail);

    httpMock
      .expectOne(`${testBaseUrl}/organizations/suggestions?term=zer`)
      .flush([
        {id: '5ae06f3da9941545df22cd03', name: 'Buzzer'},
        {id: '5ae06f3da9941545df22cd49', name: 'Buzz'}
      ] as Organization[]);
  });
});
