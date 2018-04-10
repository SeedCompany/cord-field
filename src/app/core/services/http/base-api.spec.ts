import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { BaseApiService } from './base-api';

describe('BaseApiService', () => {
  let request: HttpTestingController;
  let api: MockApiService;

  @Injectable()
  class MockApiService extends BaseApiService {
    constructor(http: HttpClient) {
      super(http, 'profile.illuminations.bible');
    }
  }

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
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

  it('injects base url', (done) => {
    api
      .get('/test')
      .subscribe(done, done.fail);

    request
      .expectOne(`${environment.services['profile.illuminations.bible']}/test`)
      .flush({});
  });
});
