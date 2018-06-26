import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { Location } from '../models/location';
import { LocationService } from './location.service';

const testBaseUrl = environment.services['plo.cord.bible'];

describe('LocationService', () => {

  let httpMock: HttpTestingController;
  let locationService: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ]
    });
    locationService = TestBed.get(LocationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Search', (done: DoneFn) => {
    const mockResponse: Location[] = [
      Location.fromJson({
        country: 'Nigeria',
        area: {
          name: 'Anglophone Africa',
          region: {
            name: 'Africa'
          }
        }
      } as Partial<Location>)
    ];
    const term = 'Nigeria';

    locationService
      .search(term)
      .then((data: Location[]) => {
        expect(data[0].constructor.name).toEqual('Location');
        expect(data[0].country).toBe('Nigeria');
        done();
      })
      .catch(done.fail);

    httpMock
      .expectOne(`${testBaseUrl}/locations/suggestions?term=${term}`)
      .flush(mockResponse);
  });
});
