import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { CoreModule } from '../../core.module';
import { AuthenticationStorageService } from '../authentication-storage.service';
import { BaseApiService } from './base-api';
import { SERVICE_AUDIENCE } from './profile-api.service';

describe('BaseApiService', () => {
  let request: HttpTestingController;
  let api: MockApiService;

  @Injectable()
  class MockApiService extends BaseApiService {
    constructor(authStorage: AuthenticationStorageService, httpClient: HttpClient) {
      super(authStorage, SERVICE_AUDIENCE, httpClient);
    }
  }

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          CoreModule,
          HttpClientTestingModule
        ],
        providers: [
          MockApiService
        ]
      });

    api = TestBed.get(MockApiService);
    request = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    request.verify();
  });

  it('injects base url', (done: DoneFn) => {

    api
      .get('/test')
      .subscribe(done, done.fail);

    request
      .expectOne(`${environment.services['profile.illuminations.bible']}/test`)
      .flush({});
  });
});
