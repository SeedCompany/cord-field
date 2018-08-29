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

  it('should get language list', (done: DoneFn) => {

    const sort = 'updatedAt';
    const skip = 0;
    const limit = 10;
    const order = 'desc';
    const languageListUrl = `${testBaseUrl}/languages?sort=${sort}&skip=${skip}&limit=${limit}&order=${order}`;
    const mockResponse = [{
      id: '5acbba0c70db6a1781ece783',
      displayName: 'Tandroy',
      ethnologueCode: 'tan',
      locations: [
        {id: '5b858a4ca77d2381ea22d7bb', country: 'Philippines'},
        {id: '5b858a4ca77d232e3622d7ae', country: 'India'}
      ]
    }];

    languageService
      .getLanguages('updatedAt', 'desc', 0, 10)
      .toPromise()
      .then((languagesWithCount) => {
        const languages = languagesWithCount.languages;
        const locations = languages[0].locations;
        expect(languagesWithCount.total).toBe(0);
        expect(languages.length).not.toBe(0);
        expect(languages[0].id).toBeDefined();
        expect(languages[0].id).toBe('5acbba0c70db6a1781ece783');
        expect(languages[0].displayName).toBeDefined();
        expect(languages[0].displayName).toBe('Tandroy');
        expect(locations).toBeDefined();
        expect(locations[0].id).toBe('5b858a4ca77d2381ea22d7bb');
        expect(locations[0].country).toBe('Philippines');
        expect(locations[1].id).toBe('5b858a4ca77d232e3622d7ae');
        expect(locations[1].country).toBe('India');
      })
      .then(done)
      .catch(done.fail);

    httpMock
      .expectOne(languageListUrl)
      .flush(mockResponse);
    httpMock.verify();

  });
});
