import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Location } from '../models/location';
import { PloApiService } from './http/plo-api.service';

import { CoreModule } from '../core.module';
import { LocationService } from './location.service';

const testBaseUrl = environment.services['plo.cord.bible'];
describe('LocationService', () => {


  let httpMockService: HttpTestingController;
  let locationService: LocationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ],
      providers: [
        LocationService,
        PloApiService
      ]
    });
    locationService = TestBed.get(LocationService);
    httpMockService = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([LocationService], (service: LocationService) => {
    expect(service).toBeTruthy();
  }));

  it('Get Location Details', (done: DoneFn) => {
    const mockResponse: Location[] = [
      {
        'area': {
          'id': '5ae06f3da9941545df22ccf8',
          'name': 'Anglophone Africa'
        },
        'country': 'Nigeria',
        'id': '5ae06f3da9941545df22cd03',
        'region': {
          'id': '5ae06f3da9941545df22ccf3',
          'name': 'Africa'
        }
      },
      {
        'area': {
          'id': '5ae06f3da9941545df22ccf7',
          'name': 'any'
        },
        'country': 'Nigeria',
        'id': '5ae06f3da9941545df22cd49',
        'region': {
          'id': '5ae06f3da9941545df22ccf6',
          'name': 'Not Specified'
        }
      }
    ];
    const term = 'Nigeria';
    const locationUrl = `${testBaseUrl}/locations/suggestions?term=${term}`;
    locationService
      .search(term)
      .then((data) => {
        expect(data[0].country).toBe('Nigeria');
        done();
      })
      .catch(done.fail);

    httpMockService
      .expectOne(locationUrl)
      .flush(mockResponse);
    httpMockService.verify();

  });
});
