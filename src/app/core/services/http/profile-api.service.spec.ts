import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { CoreModule } from '../../core.module';
import { ProfileApiService } from './profile-api.service';

describe('ProfileApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([ProfileApiService], (service: ProfileApiService) => {
    expect(service).toBeTruthy();
  }));
});
