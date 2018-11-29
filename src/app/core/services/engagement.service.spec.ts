import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@app/core/core.module';
import { Engagement, ModifiedEngagement, ProjectApproach, ProjectMedium, ProjectProduct } from '@app/core/models/engagement';
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
        HttpClientTestingModule,
      ],
    });
    httpMock = TestBed.get(HttpTestingController);
    engagementService = TestBed.get(EngagementService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get a project by id', (done: DoneFn) => {
    const id = 'iBFFFGvBVlIpvsKVanrbIYVBaPwkDnhjjb0.n_cPm_zyG_7D7WWLDT7ozQ.zfUnrX9tXoPtWtDc9PLhUw';
    const url = `${testBaseUrl}/engagements/${id}`;
    const mockResponse = {
      id,
      language: {
        id: 'languageId',
      },
      products: [ProjectProduct.FullBible],
      mediums: [ProjectMedium.EBook],
      updatedAt: '2018-03-26T05:27:49.000Z',
      tags: [],
    };

    engagementService.getEngagement(id)
      .then((engagement: Engagement) => {
        expect(engagement.id).toBeDefined();
        expect(engagement.products).toBeDefined();
        expect(Array.isArray(engagement.products)).toBe(true);
        expect(Array.isArray(engagement.mediums)).toBe(true);
        done();
      })
      .catch(done.fail);

    httpMock
      .expectOne(url)
      .flush(mockResponse);
  });

  it('should save engagement data', (done: DoneFn) => {
    const id = 'iBFFFGvBVlIpvsKVanrbIYVBaPwkDnhjjb0.n_cPm_zyG_7D7WWLDT7ozQ.zfUnrX9tXoPtWtDc9PLhUw';
    const modified: ModifiedEngagement = {
      products: [ProjectProduct.FullBible],
      mediums: [ProjectMedium.EBook],
      approaches: [ProjectApproach.OralStorying],
      tags: ['luke_partnership'],
      isDedicationPlanned: false,
      dedicationDate: null,
    };

    engagementService.save(id, modified)
      .then(done)
      .catch(done.fail);

    httpMock
      .expectOne(`${testBaseUrl}/engagements/${id}/save`)
      .flush({});
  });
});
