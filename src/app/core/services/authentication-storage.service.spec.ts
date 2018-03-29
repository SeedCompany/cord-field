import { inject, TestBed } from '@angular/core/testing';

import { AuthenticationStorageService } from './authentication-storage.service';

describe('AuthenticationStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationStorageService]
    });
  });

  it('should be created', inject([AuthenticationStorageService], (service: AuthenticationStorageService) => {
    expect(service).toBeTruthy();
  }));
});
