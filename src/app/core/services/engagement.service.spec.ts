import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@app/core/core.module';
import { BibleBook } from '@app/core/models/bible-book';
import { EditableEngagement, Engagement, EngagementStatus } from '@app/core/models/engagement';
import { Product, ProductMedium, ProductMethodology, ProductPurpose, ProductType } from '@app/core/models/product';
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
      products: [
        {
          id: '1234',
          approach: 'written',
          methodology: ProductMethodology.Paratext,
          type: ProductType.Gospel,
          books: [BibleBook.Luke],
          purposes: [ProductPurpose.ChurchLife],
          mediums: [ProductMedium.Print],
        },
      ],
      updatedAt: '2018-03-26T05:27:49.000Z',
      tags: [],
    };

    engagementService.getEngagement(id)
      .then((engagement: Engagement) => {
        expect(engagement.id).toBeDefined();
        expect(engagement.products).toBeDefined();
        expect(Array.isArray(engagement.products)).toBe(true);
        done();
      })
      .catch(done.fail);

    httpMock
      .expectOne(url)
      .flush(mockResponse);
  });

  it('should save engagement data', (done: DoneFn) => {
    const id = 'iBFFFGvBVlIpvsKVanrbIYVBaPwkDnhjjb0.n_cPm_zyG_7D7WWLDT7ozQ.zfUnrX9tXoPtWtDc9PLhUw';
    const modified: EditableEngagement = {
      status: EngagementStatus.Active,
      products: [
        Product.from({
          id: '1234',
          approach: 'written',
          methodology: ProductMethodology.Paratext,
          type: ProductType.Gospel,
          books: [BibleBook.Luke],
          purposes: [ProductPurpose.ChurchLife],
          mediums: [ProductMedium.Print],
        }),
      ],
      tags: ['luke_partnership'],
      completeDate: null,
      disbursementCompleteDate: null,
      communicationsCompleteDate: null,
      ceremonyEstimatedDate: null,
      ceremonyActualDate: null,
    };

    engagementService.save(id, modified)
      .then(done)
      .catch(done.fail);

    httpMock
      .expectOne(`${testBaseUrl}/engagements/${id}/save`)
      .flush({});
  });
});
