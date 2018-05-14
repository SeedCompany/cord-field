import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { removeTestCredentials, saveTestCredentials } from '../../../../test.spec';
import { CoreModule, httpInterceptorProviders } from '../../core.module';
import { AuthenticationStorageService } from '../authentication-storage.service';
import { AuthInterceptor } from './auth-interceptor';
import { PloApiService } from './plo-api.service';

describe('AuthInterceptor', () => {
  let authInterceptor: AuthInterceptor;
  let authStorageService: AuthenticationStorageService;
  let ploApiService: PloApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientModule
      ],
      providers: [
        HttpClient,
        httpInterceptorProviders
      ]
    });

    authStorageService = TestBed.get(AuthenticationStorageService);
    ploApiService = TestBed.get(PloApiService);
    authInterceptor = TestBed.get(AuthInterceptor);
  });

  afterEach(async () => {
    await removeTestCredentials(authStorageService);
  });

  it('verify 401 without credentials as sanity check', async () => {

    await ploApiService
      .get('/projects', {observe: 'response'})
      .toPromise()
      .catch((e) => expect(e.status).toBe(401));

  });

  it('injects credentials and gets 200', async () => {

    await saveTestCredentials(authStorageService);

    const result = await ploApiService
      .get('/projects', {observe: 'response'})
      .toPromise();

    expect(result.status).toBe(200);

  });

  it('interceptor gets called with requests (explicit test)', async () => {

    spyOn(authInterceptor, 'intercept').and.callThrough();

    await ploApiService
      .get('/projects', {observe: 'response'})
      .toPromise()
      .catch((e) => expect(e.status).toBe(401));

    expect(authInterceptor.intercept).toHaveBeenCalledTimes(1);

  });

});
