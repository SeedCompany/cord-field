import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { CoreModule } from '@app/core/core.module';
import { Engagement, ModifiedEngagement, ProjectMedium, ProjectProduct } from '@app/core/models/engagement';
import { environment } from '../../../environments/environment';
import { EngagementService } from './engagement.service';

const testBaseUrl = environment.services['plo.cord.bible'];
describe('EngagementService', () => {

  let httpMock: HttpTestingController;
  let engagementService: EngagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    engagementService = TestBed.get(EngagementService);
  });

  it('should be created', inject([EngagementService], (service: EngagementService) => {
    expect(service).toBeTruthy();
  }));
  it('should get a project by id', (done: DoneFn) => {
    const id = 'iBFFFGvBVlIpvsKVanrbIYVBaPwkDnhjjb0.n_cPm_zyG_7D7WWLDT7ozQ.zfUnrX9tXoPtWtDc9PLhUw';
    const url = `${testBaseUrl}/engagements/${id}`;
    const mockResponse = {
      id,
      products: [ProjectProduct.FullBible],
      mediums: [ProjectMedium.EBook],
      updatedAt: '2018-03-26T05:27:49.000Z',
      isLukePartnership: false,
      isFirstScripture: false
    };

    engagementService.getEngagement(id)
      .then((engagement: Engagement) => {
        expect(engagement.id).toBeDefined();
        expect(engagement.products).toBeDefined();
        expect(Array.isArray(engagement.products)).toBe(true);
        expect(Array.isArray(engagement.mediums)).toBe(true);
        expect(engagement.isLukePartnership).toBe(false);
        expect(engagement.isFirstScripture).toBe(false);
      })
      .then(done)
      .catch(done.fail);

    httpMock
      .expectOne(url)
      .flush(mockResponse);
    httpMock.verify();
  });
  it('should save engagement data', (done: DoneFn) => {
    const id = 'iBFFFGvBVlIpvsKVanrbIYVBaPwkDnhjjb0.n_cPm_zyG_7D7WWLDT7ozQ.zfUnrX9tXoPtWtDc9PLhUw';
    const url = `${testBaseUrl}/engagements/${id}/save`;
    const mockData: ModifiedEngagement = {
      products: [ProjectProduct.FullBible],
      mediums: [ProjectMedium.EBook]
    };

    engagementService.save(id, mockData)
      .then(done)
      .catch(done.fail);

    httpMock
      .expectOne(url)
      .flush({});
    httpMock.verify();
  });
});
