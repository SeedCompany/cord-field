import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { CoreModule } from '../../core.module';
import { PloApiService } from './plo-api.service';

describe('PloApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule,
      ],
      providers: [
        PloApiService,
        HttpClient,
      ],
    });
  });

  it('should be created', inject([PloApiService], (service: PloApiService) => {
    expect(service).toBeTruthy();
  }));
});
