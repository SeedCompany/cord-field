import { inject, TestBed } from '@angular/core/testing';

import { ProfileApiService } from './profile-api.service';

describe('ProfileApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileApiService]
    });
  });

  it('should be created', inject([ProfileApiService], (service: ProfileApiService) => {
    expect(service).toBeTruthy();
  }));
});
