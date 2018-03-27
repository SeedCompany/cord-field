import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { PloApiService } from './plo-api.service';

describe('PloApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        PloApiService,
        HttpClient
      ]
    });
  });

  it('should be created', inject([PloApiService], (service: PloApiService) => {
    expect(service).toBeTruthy();
  }));
});
