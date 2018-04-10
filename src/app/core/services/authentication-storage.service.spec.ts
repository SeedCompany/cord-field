import { inject, TestBed } from '@angular/core/testing';
import { CoreModule } from '../core.module';
import { AuthenticationStorageService } from './authentication-storage.service';

describe('AuthenticationStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule
      ]
    });
  });

  it('should be created', inject([AuthenticationStorageService], (service: AuthenticationStorageService) => {
    expect(service).toBeTruthy();
  }));
});
