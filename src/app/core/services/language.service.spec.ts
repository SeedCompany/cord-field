import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { Language } from '../models/language';
import { LanguageService } from './language.service';

const testBaseUrl = environment.services['plo.cord.bible'];

describe('LanguageService', () => {

  let httpMock: HttpTestingController;
  let languageService: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ],
      providers: [
        LanguageService
      ]
    });
    languageService = TestBed.get(LanguageService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Search', (done: DoneFn) => {
    const mockResponse: Language[] = [
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

    httpMock
      .expectOne(locationUrl)
      .flush(mockResponse);
  });
});
