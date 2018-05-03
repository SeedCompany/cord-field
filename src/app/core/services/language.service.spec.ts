import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { Language } from '../models/language';
import { PloApiService } from './http/plo-api.service';
import { LanguageService } from './language.service';


const testBaseUrl = environment.services['plo.cord.bible'];

describe('LanguageService', () => {

  let httpMockService: HttpTestingController;
  let languageService: LanguageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ],
      providers: [
        LanguageService,
        PloApiService
      ]
    });
    languageService = TestBed.get(LanguageService);
    httpMockService = TestBed.get(HttpTestingController);
  });
  it('should be created', inject([LanguageService], (service: LanguageService) => {
    expect(service).toBeTruthy();
  }));

  it('Get Language Details by name', (done: DoneFn) => {

    const mockResponse = [
      Language.fromJson({
      id: '5aeb29907e8ca80001db91a8',
      name: 'Aari'
      })
    ];
    const term = 'aa';
    const locationUrl = `${testBaseUrl}/languages/suggestions?term=${term}`;

    languageService.search(term)
      .then((data: Language[]) => {
        expect(data[0].name).toEqual('Aari');
        done();
      })
      .catch(done.fail);

    httpMockService
      .expectOne(locationUrl)
      .flush(mockResponse);
    httpMockService.verify();

  });
});
