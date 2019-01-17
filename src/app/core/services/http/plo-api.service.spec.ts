import { inject, TestBed } from '@angular/core/testing';
import { CoreTestModule } from '@app/core/core-test.module';
import { CoreModule } from '../../core.module';
import { PloApiService } from './plo-api.service';

describe('PloApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        CoreTestModule,
      ],
    });
  });

  it('should be created', inject([PloApiService], (service: PloApiService) => {
    expect(service).toBeTruthy();
  }));
});
